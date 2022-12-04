import {NextFunction, Request, Response, Router} from "express";
import {body} from "express-validator";
import {checkRefreshToken, checkToken, middleware} from "../middlewares/middleware";
import {AuthService} from "../domain/auth-service";
import {UsersRepository} from "../repositories/users-repository";
import {countAttemptCollection, registrationUsersCollection, usersCollection} from "../db/db";
import {container} from "../composition-root";
import {EmailManager} from "../manager/email-manager";
import {EmailAdapter} from "../adapters/email-adapter";
import {AuthController} from "../controller-classes/auth-controller";

const authController = container.resolve(AuthController);

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
    const loginTrue = await new UsersRepository().findLoginOrEmail(login);
    if (loginTrue !== null) {
        throw new Error("Такое имя уже существует");
    }
    return true;
});
const emailIsOriginal = body("email").custom(async (email) => {
    const emailTrue = await new UsersRepository().findLoginOrEmail(email);
    if (emailTrue !== null) {
        throw new Error("Такое имя уже существует");
    }
});
const emailDontExist = body("email").custom(async (email) => {
    const emailTrue = await new UsersRepository().findLoginOrEmail(email);
    if (emailTrue === null) {
        throw new Error("Такого email не существует");
    }
});
const checkCode = body("code").custom(async (code) => {
    if (!await new AuthService(new EmailManager(new EmailAdapter()), new UsersRepository()).confirmEmail(code)) {
        throw new Error("Не верный код");
    }
});
const checkRecoveryCode = body("recoveryCode").custom(async (code) => {
    if (!await new AuthService(new EmailManager(new EmailAdapter()), new UsersRepository()).confirmRecoveryCode(code)) {
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

authRouter.post("/login", checkCountAttempts, checkLoginOrEmail, checkPassword, middleware, authController.loginUser.bind(authController));
authRouter.get("/me", checkToken, authController.getInfoAboutMe.bind(authController));
authRouter.post("/registration-confirmation", checkCountAttempts, checkCode, middleware, authController.registrationConfirmation.bind(authController));
authRouter.post("/registration", checkCountAttempts, loginIsOriginal, emailIsOriginal, checkLoginForAuthLength, checkPasswordForAuthLength, checkEmail, middleware, authController.registration.bind(authController));
authRouter.post("/registration-email-resending", checkCountAttempts, checkEmail, checkEmailConfirmation, emailDontExist, middleware, authController.registrationEmailResending.bind(authController));
authRouter.post("/refresh-token", checkCountAttempts, checkRefreshToken, authController.createRefreshToken.bind(authController));
authRouter.post("/logout", checkRefreshToken, authController.logout.bind(authController));
authRouter.post("/password-recovery", checkCountAttempts, checkEmail, middleware, authController.passwordRecovery.bind(authController));
authRouter.post("/new-password", checkCountAttempts, checkNewPassword, checkRecoveryCode, middleware, authController.createNewPassword.bind(authController));