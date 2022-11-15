import {NextFunction, Request, Response} from "express";
import {validationResult} from "express-validator";
import {jwtService} from "../application/jwt-service";
import {usersService} from "../domain/users-service";
import {usersPassword} from "../auth-users/usersPasswords";
import {refreshTokenDataCollection} from "../db/db";

export const middleWare = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const errorsMessages = errors.array({onlyFirstError: true}).map(e => {
            return {
                message: e.msg,
                field: e.param
            }
        });
        return res.status(400).json({errorsMessages});
    }
    next();
};

export const checkToken = async (req: Request, res: Response, next: NextFunction) => {
    if (!req.headers.authorization || req.headers.authorization.split(".").length !== 3) {
        res.sendStatus(401);
    } else {
        const token = req.headers.authorization!.split(" ")[1];
        const userId = await jwtService.getUserIdByToken(token);
        if (userId) {
            req.user = await usersService.getUserById(userId.toString());
            if (req.user !== null) {
                next();
            } else {
                res.sendStatus(401);
            }
        } else {
            res.sendStatus(401);
        }
    }
};

export const checkRefreshToken = async (req: Request, res: Response, next: NextFunction) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
        res.sendStatus(401);
        return;
    }
    const user: any = await jwtService.getUserByRefreshToken(refreshToken);
    if (!user) {
        res.sendStatus(401);
        return;
    }
    const device = await refreshTokenDataCollection.findOne({$and: [{deviceId: user.deviceId}, {userId: user.userId}]});
    if (device?.iat !== user!.iat) {
        res.sendStatus(401);
        return;
    }
    next();
};

export const aut = (req: Request, res: Response, next: NextFunction) => {
    if (req.headers.authorization === usersPassword[0]) {
        next();
    } else {
        res.sendStatus(401);
    }
};