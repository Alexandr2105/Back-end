import {Router, Request, Response, NextFunction} from "express";
import {checkRefreshToken, middleWare} from "../middlewares/middleware";
import {JwtService} from "../application/jwt-service";
import {DevicesService} from "../domain/devices-service";
import {refreshTokenDataCollection} from "../db/db";
import {SecurityDevicesRepository} from "../repositories/security-devices-repository";

export const securityDevicesRouter = Router();

const checkUser = async (req: Request, res: Response, next: NextFunction) => {
    const deviceId = await refreshTokenDataCollection.findOne({deviceId: req.params.devices});
    if (deviceId === null) {
        res.sendStatus(404);
        return;
    }
    if (deviceId.userId === req.user.userId) {
        next();
    } else {
        res.sendStatus(403);
    }
};

class SecurityDevicesController {
    private devicesService: DevicesService;
    private securityDevicesRepository: SecurityDevicesRepository;
    private jwtService: JwtService;

    constructor() {
        this.devicesService = new DevicesService();
        this.securityDevicesRepository = new SecurityDevicesRepository();
        this.jwtService = new JwtService();
    }

    async getDevices(req: Request, res: Response) {
        const user: any = this.jwtService.getUserByRefreshToken(req.cookies.refreshToken);
        const allDevicesUser = await this.securityDevicesRepository.getAllDevicesUser(user.userId);
        res.send(allDevicesUser);
    };

    async deleteDevices(req: Request, res: Response) {
        const user: any = this.jwtService.getUserByRefreshToken(req.cookies.refreshToken);
        await this.devicesService.delAllDevicesExcludeCurrent(user.deviceId);
        res.sendStatus(204);
    };

    async deleteDevice(req: Request, res: Response) {
        const deviceId = req.params.devices;
        const result = await this.devicesService.delDevice(deviceId);
        if (result) res.sendStatus(204);
    };
}

const securityDevicesController = new SecurityDevicesController();

securityDevicesRouter.get("/", checkRefreshToken, middleWare, securityDevicesController.getDevices.bind(securityDevicesController));
securityDevicesRouter.delete("/", checkRefreshToken, middleWare, securityDevicesController.deleteDevices.bind(securityDevicesController));
securityDevicesRouter.delete("/:devices", checkRefreshToken, checkUser, middleWare, securityDevicesController.deleteDevice.bind(securityDevicesController));
