import {NextFunction, Request, Response} from "express";
import {validationResult} from "express-validator";
import {jwtService} from "../application/jwt-service";
import {usersService} from "../domain/users-service";
import {usersPassword} from "../auth-users/usersPasswords";
import {refreshTokenDataCollection} from "../db/db";

class MiddlewareController {
    middleWare(req: Request, res: Response, next: NextFunction) {
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

    async checkToken(req: Request, res: Response, next: NextFunction) {
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

    async checkRefreshToken(req: Request, res: Response, next: NextFunction) {
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
        req.user = user;
        const device = await refreshTokenDataCollection.findOne({$and: [{deviceId: user.deviceId}, {userId: user.userId}]});
        if (device?.iat !== user!.iat) {
            res.sendStatus(401);
            return;
        }
        next();
    };

    aut(req: Request, res: Response, next: NextFunction) {
        if (req.headers.authorization === usersPassword[0]) {
            next();
        } else {
            res.sendStatus(401);
        }
    };
}

const middleWareController = new MiddlewareController();

export const middleWare = middleWareController.middleWare;

export const checkToken = middleWareController.checkToken;

export const checkRefreshToken = middleWareController.checkRefreshToken;

export const aut = middleWareController.aut;