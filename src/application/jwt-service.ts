import jwt from 'jsonwebtoken'
import {UserType} from "../db/db";
import {settings} from "../settings";

export const jwtService = {
    creatJWT(user: UserType) {
        return jwt.sign({userId: user.id}, settings.JWT_SECRET, {expiresIn:settings.TOKEN_LIFE});
    },
    creatRefreshJWT(user: UserType) {
        return jwt.sign({userId: user.id}, settings.REFRESH_TOKEN_SECRET, {expiresIn:settings.REFRESH_TOKEN_LIFE});
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