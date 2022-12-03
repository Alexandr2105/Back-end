import {JwtService} from "../application/jwt-service";
import {UsersService} from "../domain/users-service";
import {NextFunction, Request, Response} from "express";
import {validationResult} from "express-validator";
import {refreshTokenDataCollection} from "../db/db";
import {usersPassword} from "../auth-users/usersPasswords";

export class MiddlewareController {

    constructor(protected jwtService: JwtService,
                protected usersService: UsersService) {
    };

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
            const userId = await this.jwtService.getUserIdByToken(token);
            if (userId) {
                req.user = await this.usersService.getUserById(userId.toString());
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
        const user: any = await this.jwtService.getUserByRefreshToken(refreshToken);
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