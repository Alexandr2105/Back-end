import {NextFunction, Request, Response, Router} from "express";
import {checkRefreshToken, middleware} from "../middlewares/middleware";
import {refreshTokenDataCollection} from "../db/db";
import {container} from "../composition-root";
import {SecurityDevicesController} from "../controller-classes/security-devices-controller";

const securityDevicesController = container.resolve(SecurityDevicesController);

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

securityDevicesRouter.get("/", checkRefreshToken, middleware, securityDevicesController.getDevices.bind(securityDevicesController));
securityDevicesRouter.delete("/", checkRefreshToken, middleware, securityDevicesController.deleteDevices.bind(securityDevicesController));
securityDevicesRouter.delete("/:devices", checkRefreshToken, checkUser, middleware, securityDevicesController.deleteDevice.bind(securityDevicesController));
