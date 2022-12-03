import {SecurityDevicesRepository} from "../repositories/security-devices-repository";
import {JwtService} from "../application/jwt-service";
import {DevicesService} from "../domain/devices-service";
import {Request, Response} from "express";

export class SecurityDevicesController {
    private securityDevicesRepository: SecurityDevicesRepository;
    private jwtService: JwtService;

    constructor(protected devicesService: DevicesService) {
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