import {Router, Request, Response} from "express";
import {usersService} from "../domain/users-service";
import {jwtService} from "../application/jwt-service";

export const authRouter = Router();

authRouter.post("/login", async (req: Request, res: Response) => {
    const checkResult: any = await usersService.checkUserOrLogin(req.body.login, req.body.password);
    if (checkResult) {
        const token = jwtService.creatJWT(checkResult);
        res.send(token);
    } else {
        res.sendStatus(401);
    }
})