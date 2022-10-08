import {Router, Request, Response} from "express";
import {usersService} from "../domain/users-service";

export const authRouter = Router();

authRouter.post("/login", async (res: Response, req: Request) => {
    const checkResult = await usersService.checkUserOrLogin(req.body.loginOrEmail, req.body.password);
    if (checkResult) {
        res.status(204)
    } else {
        res.sendStatus(401);
    }
})

