import {UsersService} from "../domain/users-service";
import {UsersRepository} from "../repositories/users-repository";
import {DevicesService} from "../domain/devices-service";
import {EmailManager} from "../manager/email-manager";
import {JwtService} from "../application/jwt-service";
import {AuthService} from "../domain/auth-service";
import {Request, Response} from "express";

export class AuthController {

    constructor(protected authService: AuthService,
                protected usersService: UsersService,
                protected usersRepository: UsersRepository,
                protected devicesService: DevicesService,
                protected emailManager: EmailManager,
                protected jwtService: JwtService) {
    };

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