import {Router, Request, Response} from "express";
import {checkToken} from "../middlewares/middleware";

export const securityDevicesRouter = Router();

securityDevicesRouter.get("/", checkToken, (req: Request, res: Response) => {
    res.sendStatus(200);
});

securityDevicesRouter.delete("/", checkToken, (req: Request, res: Response) => {
    res.sendStatus(204);
});

securityDevicesRouter.delete("/:devices", checkToken, (req: Request, res: Response) => {
    res.sendStatus(204);
});