import {Router, Request, Response} from "express";
import {checkRefreshToken} from "../middlewares/middleware";
import {refreshTokenRepository} from "../repositories/refresh-token-repository";
import {jwtService} from "../application/jwt-service";

export const securityDevicesRouter = Router();

securityDevicesRouter.get("/", checkRefreshToken, async (req: Request, res: Response) => {
    const user: any = jwtService.getUserByRefreshToken(req.cookies.refreshToken);
    const allDevicesUser = await refreshTokenRepository.getAllDevicesUser(user.userId);
    res.send(allDevicesUser);
});

securityDevicesRouter.delete("/", checkRefreshToken, (req: Request, res: Response) => {
    res.sendStatus(204);
});

securityDevicesRouter.delete("/:devices", checkRefreshToken, (req: Request, res: Response) => {
    res.sendStatus(204);
});
