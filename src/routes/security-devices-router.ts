import {Router, Request, Response, NextFunction} from "express";
import {checkRefreshToken, middleWare} from "../middlewares/middleware";
import {jwtService} from "../application/jwt-service";
import {devicesService} from "../domain/devices-service";
import {refreshTokenDataCollection} from "../db/db";
import {securityDevicesRepository} from "../repositories/security-devices-repository";

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

securityDevicesRouter.get("/", checkRefreshToken, middleWare, async (req: Request, res: Response) => {
    const user: any = jwtService.getUserByRefreshToken(req.cookies.refreshToken);
    const allDevicesUser = await securityDevicesRepository.getAllDevicesUser(user.userId);
    res.send(allDevicesUser);
});

securityDevicesRouter.delete("/", checkRefreshToken, middleWare, async (req: Request, res: Response) => {
    const user: any = jwtService.getUserByRefreshToken(req.cookies.refreshToken);
    await devicesService.delAllDevicesExcludeCurrent(user.deviceId);
    res.sendStatus(204);
});

securityDevicesRouter.delete("/:devices", checkRefreshToken, checkUser, middleWare, async (req: Request, res: Response) => {
    const deviceId = req.params.devices;
    const result = await devicesService.delDevice(deviceId);
    if (result) res.sendStatus(204);
});
