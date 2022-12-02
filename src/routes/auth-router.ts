import {Router, Request, Response, NextFunction} from "express";
import {UsersService} from "../domain/users-service";
import {JwtService} from "../application/jwt-service";
import {body} from "express-validator";
import {checkRefreshToken, checkToken, middleWare} from "../middlewares/middleware";
import {AuthService} from "../domain/auth-service";
import {UsersRepository} from "../repositories/users-repository";
import {EmailManager} from "../manager/email-manager";
import {countAttemptCollection, registrationUsersCollection, usersCollection} from "../db/db";
import {DevicesService} from "../domain/devices-service";

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
    if (!await new AuthService().confirmEmail(code)) {
        throw new Error("Не верный код");
    }
});
const checkRecoveryCode = body("recoveryCode").custom(async (code) => {
    if (!await new AuthService().confirmRecoveryCode(code)) {
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

class AuthController {
    private usersService: UsersService;
    private authService: AuthService;
    private usersRepository: UsersRepository;
    private devicesService: DevicesService;
    private emailManager: EmailManager;
    private jwtService: JwtService;

    constructor() {
        this.usersService = new UsersService();
        this.authService = new AuthService();
        this.usersRepository = new UsersRepository();
        this.devicesService = new DevicesService();
        this.jwtService = new JwtService();
        this.emailManager = new EmailManager();
    }

    async loginUser(req: Request, res: Response) {
        const checkResult: any = await this.usersService.checkUserOrLogin(req.body.loginOrEmail, req.body.password);
        const deviceId = this.devicesService.createDeviceId();
        if (checkResult) {
            const token = this.jwtService.creatJWT(checkResult);
            const refreshToken = this.jwtService.creatRefreshJWT(checkResult, deviceId);
            const infoRefreshToken: any = this.jwtService.getUserByRefreshToken(refreshToken);
            await this.devicesService.saveInfoAboutDevicesUser(infoRefreshToken.iat, infoRefreshToken.exp, deviceId, infoRefreshToken.userId, req.ip, req.headers["user-agent"]);
            await this.devicesService.delOldRefreshTokenData(+new Date());
            res.cookie("refreshToken", refreshToken, {httpOnly: true, secure: true});
            res.send({accessToken: token});
        } else {
            res.sendStatus(401);
        }
    };

    async getInfoAboutMe(req: Request, res: Response) {
        const information = {
            email: req.user?.email,
            login: req.user?.login,
            userId: req.user?.id
        }
        res.send(information);
    };

    async registrationConfirmation(req: Request, res: Response) {
        const userByCode = await this.usersRepository.getUserByCode(req.body.code);
        await this.usersRepository.updateEmailConfirmation(userByCode!.userId);
        res.sendStatus(204);
    };

    async registration(req: Request, res: Response) {
        const newUser = await this.usersService.creatNewUsers(req.body.login, req.body.email, req.body.password);
        if (newUser) await this.authService.confirmation(newUser.id, req.body.login, req.body.email);
        res.sendStatus(204);
    };

    async registrationEmailResending(req: Request, res: Response) {
        const newCode: any = await this.authService.getNewConfirmationCode(req.body.email);
        const result = await this.emailManager.sendEmailAndConfirm(req.body.email, newCode);
        if (result) res.sendStatus(204);
    };

    async createRefreshToken(req: Request, res: Response) {
        const userId: any = await this.jwtService.getUserByRefreshToken(req.cookies.refreshToken);
        const user: any = await this.usersRepository.getUserId(userId.userId.toString());
        const deviceId: any = await this.jwtService.getDeviceIdRefreshToken(req.cookies.refreshToken);
        const token = this.jwtService.creatJWT(user);
        const refreshToken = this.jwtService.creatRefreshJWT(user, deviceId);
        const infoRefreshToken: any = this.jwtService.getUserByRefreshToken(refreshToken);
        await this.devicesService.updateInfoAboutDeviceUser(infoRefreshToken.iat, infoRefreshToken.exp, deviceId.toString(), req.ip, req.headers["user-agent"], userId.userId);
        res.cookie("refreshToken", refreshToken, {httpOnly: true, secure: true});
        res.send({accessToken: token});
    };

    async logout(req: Request, res: Response) {
        const user: any = await this.jwtService.getUserByRefreshToken(req.cookies.refreshToken);
        const result = await this.devicesService.delDevice(user.deviceId);
        if (result) res.sendStatus(204);
    };

    async passwordRecovery(req: Request, res: Response) {
        const recoveryCode: any = await this.authService.getNewConfirmationCode(req.body.email);
        await this.emailManager.sendEmailPasswordRecovery(req.body.email, recoveryCode);
        res.sendStatus(204);
    };

    async createNewPassword(req: Request, res: Response) {
        const userByCode = await this.usersRepository.getUserByCode(req.body.recoveryCode);
        await this.usersRepository.updateEmailConfirmation(userByCode!.userId);
        const user = await this.usersRepository.getUserByCode(req.body.recoveryCode);
        const newPass = await this.usersService.createNewPassword(req.body.newPassword, user!.userId);
        if (newPass) res.sendStatus(204);
    };
}

const authController = new AuthController();

authRouter.post("/login", checkCountAttempts, checkLoginOrEmail, checkPassword, middleWare, authController.loginUser.bind(authController));
authRouter.get("/me", checkToken, authController.getInfoAboutMe.bind(authController));
authRouter.post("/registration-confirmation", checkCountAttempts, checkCode, middleWare, authController.registrationConfirmation.bind(authController));
authRouter.post("/registration", checkCountAttempts, loginIsOriginal, emailIsOriginal, checkLoginForAuthLength, checkPasswordForAuthLength, checkEmail, middleWare, authController.registration.bind(authController));
authRouter.post("/registration-email-resending", checkCountAttempts, checkEmail, checkEmailConfirmation, emailDontExist, middleWare, authController.registrationEmailResending.bind(authController));
authRouter.post("/refresh-token", checkCountAttempts, checkRefreshToken, authController.createRefreshToken.bind(authController));
authRouter.post("/logout", checkRefreshToken, authController.logout.bind(authController));
authRouter.post("/password-recovery", checkCountAttempts, checkEmail, middleWare, authController.passwordRecovery.bind(authController));
authRouter.post("/new-password", checkCountAttempts, checkNewPassword, checkRecoveryCode, middleWare, authController.createNewPassword.bind(authController));