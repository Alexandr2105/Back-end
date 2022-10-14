import jwt from 'jsonwebtoken'
import {UsersType} from "../db/db";
import {settings} from "../settings";

export const jwtService = {
    creatJWT(user: UsersType) {
        return jwt.sign({userId: user.id}, settings.JWT_SECRET, {expiresIn: "1h"});
    },
    getUserIdByToken(token: string) {
        try {
            const result: any = jwt.verify(token, settings.JWT_SECRET);
            return new Object(result.userId);
        } catch (error) {
            return null;
        }
    }
}