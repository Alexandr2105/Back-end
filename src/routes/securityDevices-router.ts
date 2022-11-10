import {Router, Request, Response} from "express";
import {checkRefreshToken} from "../middlewares/middleware";

export const securityDevicesRouter = Router();

securityDevicesRouter.get("/", checkRefreshToken, (req: Request, res: Response) => {
    debugger;
    console.log(req.ip);
    console.log(req.headers["user-agent"]);
    res.sendStatus(200);
});

securityDevicesRouter.delete("/", checkRefreshToken, (req: Request, res: Response) => {
    res.sendStatus(204);
});

securityDevicesRouter.delete("/:devices", checkRefreshToken, (req: Request, res: Response) => {
    res.sendStatus(204);
});
