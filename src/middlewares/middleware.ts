import {NextFunction, Request, Response} from "express";
import {validationResult} from "express-validator";
import {jwtService} from "../application/jwt-service";
import {usersService} from "../domain/users-service";
import {usersPassword} from "../auth-users/usersPasswords";

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
    if (!req.headers.authorization) {
        res.sendStatus(401);
    }
    const token = req.headers.authorization!.split(" ")[1];
    const userId = await jwtService.getUserIdByToken(token);
    if (userId) {
        req.user = await usersService.getUserById(userId.toString());
        next();
    } else {
        res.sendStatus(403);
    }
};

export const aut = (req: Request, res: Response, next: NextFunction) => {
    if (req.headers.authorization === usersPassword[0]) {
        next();
    } else {
        res.sendStatus(401);
    }
};