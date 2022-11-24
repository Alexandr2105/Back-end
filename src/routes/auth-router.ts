import {Router, Request, Response, NextFunction} from "express";
import {usersService} from "../domain/users-service";
import {jwtService} from "../application/jwt-service";
import {body} from "express-validator";
import {checkRefreshToken, checkToken, middleWare} from "../middlewares/middleware";
import {authService} from "../domain/auth-service";
import {usersRepository} from "../repositories/users-repository";
import {emailManager} from "../manager/email-manager";
import {countAttemptCollection, registrationUsersCollection, usersCollection} from "../db/db";
import {devicesService} from "../domain/devices-service";

export const authRouter = Router();

const checkLoginOrEmail = body("loginOrEmail").trim().notEmpty().withMessage("Не заполнено поле логин");
const checkPassword = body("password").trim().notEmpty().withMessage("Не заполнено поле пароль");
const checkLoginForAuthLength = body("login").isLength({min: 3, max: 10}).withMessage("Не корректная длинна");
const checkPasswordForAuthLength = body("password").isLength({min: 6, max: 20}).withMessage("Не корректная длинна");
const checkEmail = body("email").isEmail().withMessage("Не верный email");
const checkEmailConfirmation = body("email").isEmail().custom(async (email) => {
    const user = await usersCollection.findOne({email: email});
    const conf = await registrationUsersCollection.findOne({userId: user?.id});
    if (conf?.isConfirmed) {
        throw new Error("Email уже поттверждён");
    }
    return true;
});
const loginIsOriginal = body("login").custom(async (login) => {
    const loginTrue = await usersRepository.findLoginOrEmail(login);
    if (loginTrue !== null) {
        throw new Error("Такое имя уже существует");
    }
    return true;
});
const emailIsOriginal = body("email").custom(async (email) => {
    const emailTrue = await usersRepository.findLoginOrEmail(email);
    if (emailTrue !== null) {
        throw new Error("Такое имя уже существует");
    }
});
const emailDontExist = body("email").custom(async (email) => {
    const emailTrue = await usersRepository.findLoginOrEmail(email);
    if (emailTrue === null) {
        throw new Error("Такого email не существует");
    }
});
const checkCode = body("code").custom(async (code) => {
    if (!await authService.confirmEmail(code)) {
        throw new Error("Не верный код");
    }
});
const checkRecoveryCode = body("recoveryCode").custom(async (code) => {
    if (!await authService.confirmRecoveryCode(code)) {
        throw new Error("Не верный код");
    }
});
const checkCountAttempts = async (req: Request, res: Response, next: NextFunction) => {
    const dataIpDevice = await countAttemptCollection.findOne({ip: req.ip});
    if (!dataIpDevice) {
        await countAttemptCollection.create({
            ip: req.ip,
            iat: +new Date(),
            method: req.method,
            originalUrl: req.originalUrl,
            countAttempt: 1
        });
        next();
        return;
    }
    if ((+new Date() - dataIpDevice!.iat) > 10000) {
        await countAttemptCollection.updateMany({ip: dataIpDevice?.ip}, {
            $set: {
                countAttempt: 1,
                iat: +new Date(),
                method: req.method,
                originalUrl: req.originalUrl
            }
        });
        next();
        return;
    } else {
        if (dataIpDevice?.countAttempt < 5 && dataIpDevice.method === req.method && dataIpDevice.originalUrl === req.originalUrl) {
            let count = dataIpDevice!.countAttempt + 1;
            await countAttemptCollection.updateOne({ip: dataIpDevice?.ip}, {$set: {countAttempt: count}})
            next();
            return;
        } else if (dataIpDevice?.countAttempt < 5 || dataIpDevice.method !== req.method || dataIpDevice.originalUrl !== req.originalUrl) {
            await countAttemptCollection.updateMany({ip: dataIpDevice?.ip}, {
                $set: {
                    countAttempt: 1,
                    iat: +new Date(),
                    method: req.method,
                    originalUrl: req.originalUrl
                }
            });
            next();
            return;
        } else {
            res.sendStatus(429);
        }
    }
};
const checkNewPassword = body("newPassword").trim().notEmpty().withMessage("Не заполнено поле пароль").isLength({
    min: 6,
    max: 20
});

authRouter.post("/login", checkCountAttempts, checkLoginOrEmail, checkPassword, middleWare, async (req: Request, res: Response) => {
    const checkResult: any = await usersService.checkUserOrLogin(req.body.loginOrEmail, req.body.password);
    const deviceId = devicesService.createDeviceId();
    if (checkResult) {
        const token = jwtService.creatJWT(checkResult);
        const refreshToken = jwtService.creatRefreshJWT(checkResult, deviceId);
        const infoRefreshToken: any = jwtService.getUserByRefreshToken(refreshToken);
        await devicesService.saveInfoAboutDevicesUser(infoRefreshToken.iat, infoRefreshToken.exp, deviceId, infoRefreshToken.userId, req.ip, req.headers["user-agent"]);
        await devicesService.delOldRefreshTokenData(+new Date());
        res.cookie("refreshToken", refreshToken, {httpOnly: true, secure: true});
        res.send({accessToken: token});
    } else {
        res.sendStatus(401);
    }
});

authRouter.get("/me", checkToken, async (req: Request, res: Response) => {
    const information = {
        email: req.user?.email,
        login: req.user?.login,
        userId: req.user?.id
    }
    res.send(information);
});

authRouter.post("/registration-confirmation", checkCountAttempts, checkCode, middleWare, async (req: Request, res: Response) => {
    const userByCode = await usersRepository.getUserByCode(req.body.code);
    await usersRepository.updateEmailConfirmation(userByCode!.userId);
    res.sendStatus(204);
});

authRouter.post("/registration", checkCountAttempts, loginIsOriginal, emailIsOriginal, checkLoginForAuthLength, checkPasswordForAuthLength, checkEmail, middleWare, async (req: Request, res: Response) => {
    const newUser = await usersService.creatNewUsers(req.body.login, req.body.email, req.body.password);
    if (newUser) await authService.confirmation(newUser.id, req.body.login, req.body.email);
    res.sendStatus(204);
});

authRouter.post("/registration-email-resending", checkCountAttempts, checkEmail, checkEmailConfirmation, emailDontExist, middleWare, async (req: Request, res: Response) => {
    const newCode: any = await authService.getNewConfirmationCode(req.body.email);
    const result = await emailManager.sendEmailAndConfirm(req.body.email, newCode);
    if (result) res.sendStatus(204);
});

authRouter.post("/refresh-token", checkCountAttempts, checkRefreshToken, async (req: Request, res: Response) => {
    const userId: any = await jwtService.getUserByRefreshToken(req.cookies.refreshToken);
    const user: any = await usersRepository.getUserId(userId.userId.toString());
    const deviceId: any = await jwtService.getDeviceIdRefreshToken(req.cookies.refreshToken);
    const token = jwtService.creatJWT(user);
    const refreshToken = jwtService.creatRefreshJWT(user, deviceId);
    const infoRefreshToken: any = jwtService.getUserByRefreshToken(refreshToken);
    await devicesService.updateInfoAboutDeviceUser(infoRefreshToken.iat, infoRefreshToken.exp, deviceId.toString(), req.ip, req.headers["user-agent"], userId.userId);
    res.cookie("refreshToken", refreshToken, {httpOnly: true, secure: true});
    res.send({accessToken: token});
});

authRouter.post("/logout", checkRefreshToken, async (req: Request, res: Response) => {
    const user: any = await jwtService.getUserByRefreshToken(req.cookies.refreshToken);
    const result = await devicesService.delDevice(user.deviceId);
    if (result) res.sendStatus(204);
});

authRouter.post("/password-recovery", checkCountAttempts, checkEmail, middleWare, async (req: Request, res: Response) => {
    const recoveryCode: any = await authService.getNewConfirmationCode(req.body.email);
    await emailManager.sendEmailPasswordRecovery(req.body.email, recoveryCode);
    res.sendStatus(204);
});

authRouter.post("/new-password", checkCountAttempts, checkNewPassword, checkRecoveryCode, middleWare, async (req: Request, res: Response) => {
    const userByCode = await usersRepository.getUserByCode(req.body.recoveryCode);
    await usersRepository.updateEmailConfirmation(userByCode!.userId);
    const user = await usersRepository.getUserByCode(req.body.recoveryCode);
    const newPass = await usersService.createNewPassword(req.body.newPassword, user!.userId);
    if (newPass) res.sendStatus(204);
});