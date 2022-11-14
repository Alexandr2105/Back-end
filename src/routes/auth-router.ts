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

const checkLogin = body("login").trim().notEmpty().withMessage("Не заполнено поле логин");
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
const checkCountAttempts = async (req: Request, res: Response, next: NextFunction) => {
    debugger;
    const dataIpDevice = await countAttemptCollection.findOne({ip: req.ip});
    if (!dataIpDevice) {
        await countAttemptCollection.insertOne({ip: req.ip, iat: +new Date(), countAttempt: 1});
        next();
        return;
    }
    if ((+new Date() - dataIpDevice!.iat) < 100) {
        await countAttemptCollection.updateMany({ip: dataIpDevice?.ip}, {$set: {countAttempt: 1, iat: +new Date()}});
        next();
        return;
    } else {
        if (dataIpDevice?.countAttempt <= 5) {
            let count = dataIpDevice!.countAttempt + 1;
            await countAttemptCollection.updateOne({ip: dataIpDevice?.ip}, {$set: {countAttempt: count}})
            next();
            return;
        } else {
            res.sendStatus(429);
        }
    }
}

authRouter.post("/login", checkLogin, checkPassword, checkCountAttempts, middleWare, async (req: Request, res: Response) => {
    const checkResult: any = await usersService.checkUserOrLogin(req.body.login, req.body.password);
    const deviceId = devicesService.createDeviceId();
    if (checkResult) {
        const token = jwtService.creatJWT(checkResult);
        const refreshToken = jwtService.creatRefreshJWT(checkResult, deviceId);
        const infoRefreshToken: any = jwtService.getUserByRefreshToken(refreshToken);
        await devicesService.saveInfoAboutDevicesUser(infoRefreshToken.iat, infoRefreshToken.exp, deviceId, infoRefreshToken.userId, req.ip, req.headers["user-agent"]);
        res.cookie("refreshToken", refreshToken, {httpOnly: true});
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

authRouter.post("/registration-confirmation", checkCode, checkCountAttempts, middleWare, async (req: Request, res: Response) => {
    res.sendStatus(204);
});

authRouter.post("/registration", loginIsOriginal, emailIsOriginal, checkLoginForAuthLength, checkPasswordForAuthLength, checkEmail, checkCountAttempts, middleWare, async (req: Request, res: Response) => {
    const newUser = await usersService.creatNewUsers(req.body.login, req.body.email, req.body.password);
    if (newUser) await authService.confirmation(newUser.id, req.body.login, req.body.email);
    res.sendStatus(204);
});

authRouter.post("/registration-email-resending", checkEmail, checkEmailConfirmation, emailDontExist, checkCountAttempts, middleWare, async (req: Request, res: Response) => {
    const newCode: any = await authService.getNewConfirmationCode(req.body.email);
    const result = await emailManager.sendEmailAndConfirm(req.body.email, newCode);
    if (result) res.sendStatus(204);
});

authRouter.post("/refresh-token", checkRefreshToken, checkCountAttempts, async (req: Request, res: Response) => {
    const userId: any = await jwtService.getUserByRefreshToken(req.cookies.refreshToken);
    const user: any = await usersRepository.getUserId(userId.userId.toString());
    const deviceId: any = await jwtService.getDeviceIdRefreshToken(req.cookies.refreshToken);
    const token = jwtService.creatJWT(user);
    const refreshToken = jwtService.creatRefreshJWT(user, deviceId);
    res.cookie("refreshToken", refreshToken, {httpOnly: true});
    res.send({accessToken: token});
});

authRouter.post("/logout", checkRefreshToken, async (req: Request, res: Response) => {
    const user: any = await jwtService.getUserByRefreshToken(req.cookies.refreshToken);
    const result = await devicesService.delDevice(user.deviceId);
    if (result) res.sendStatus(204);
});