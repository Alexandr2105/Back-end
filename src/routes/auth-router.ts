import {Router, Request, Response} from "express";
import {usersService} from "../domain/users-service";

export const authRouter = Router();

authRouter.post("/login", async (req: Request, res: Response) => {
    console.log('req.body.login',req.body.login);
    const checkResult = await usersService.checkUserOrLogin(req.body.login, req.body.password);
    if (checkResult) {
        res.sendStatus(204);
    } else {
        res.sendStatus(401);
    }
})