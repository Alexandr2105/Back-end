import {Router, Request, Response} from "express";
import {usersService} from "../domain/users-service";
import {jwtService} from "../application/jwt-service";
import {body} from "express-validator";
import {checkToken, middleWare} from "../middlewares/middleware";

export const authRouter = Router();

const checkLoginOrPassword = body("loginOrEmail").trim().notEmpty().withMessage("Не заполнено поле");
const checkPassword = body("password").trim().notEmpty().withMessage("Не заполнено поле пароль");

authRouter.post("/login", checkLoginOrPassword, checkPassword, middleWare, async (req: Request, res: Response) => {
    const checkResult: any = await usersService.checkUserOrLogin(req.body.loginOrEmail, req.body.password);
    if (checkResult) {
        const token = jwtService.creatJWT(checkResult);
        res.send(token.toString());
    } else {
        res.sendStatus(401);
    }
});

authRouter.get("/me", checkToken, async (req: Request, res: Response) => {
    const information = {
        email: req.user?.email,
        login: req.user?.login,
        userId: req.user?.id
    }
    res.send(information);
});