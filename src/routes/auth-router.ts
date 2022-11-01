import {Router, Request, Response} from "express";
import {usersService} from "../domain/users-service";
import {jwtService} from "../application/jwt-service";
import {body} from "express-validator";
import {checkRefreshToken, checkToken, middleWare} from "../middlewares/middleware";
import {authService} from "../domain/auth-service";
import {usersRepository} from "../repositories/users-repository";
import {emailManager} from "../manager/email-manager";
import {registrationUsersCollection, usersCollection} from "../db/db";

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

authRouter.post("/login", checkLogin, checkPassword, middleWare, async (req: Request, res: Response) => {
    const checkResult: any = await usersService.checkUserOrLogin(req.body.login, req.body.password);
    if (checkResult) {
        const token = jwtService.creatJWT(checkResult);
        const refreshToken = jwtService.creatRefreshJWT(checkResult);
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

authRouter.post("/registration-confirmation", checkCode, middleWare, async (req: Request, res: Response) => {
    res.sendStatus(204);
});

authRouter.post("/registration", loginIsOriginal, emailIsOriginal, checkLoginForAuthLength, checkPasswordForAuthLength, checkEmail, middleWare, async (req: Request, res: Response) => {
    const newUser = await usersService.creatNewUsers(req.body.login, req.body.email, req.body.password);
    if (newUser) await authService.confirmation(newUser.id, req.body.login, req.body.email);
    res.sendStatus(204);
});

authRouter.post("/registration-email-resending", checkEmail, checkEmailConfirmation, emailDontExist, middleWare, async (req: Request, res: Response) => {
    const newCode: any = await authService.getNewConfirmationCode(req.body.email);
    const result = await emailManager.sendEmailAndConfirm(req.body.email, newCode);
    if (result) res.sendStatus(204);
});

authRouter.post("/refresh-token", checkRefreshToken, async (req: Request, res: Response) => {
    const userId: any = await jwtService.getUserIdByRefreshToken(req.cookies.refreshToken);
    const token = jwtService.creatJWT(userId);
    const refreshToken = jwtService.creatRefreshJWT(userId);
    res.cookie("refreshToken", refreshToken, {httpOnly: true});
    res.send({accessToken: token});
});

authRouter.post("/logout", checkRefreshToken, async (req: Request, res: Response) => {
    res.sendStatus(204);
});