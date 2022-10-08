import {Router, Request, Response, NextFunction} from "express";
import {queryRepository} from "../queryReposytories/query";
import {body} from "express-validator";
import {middleWare} from "../middlewares/middleware";
import {usersService} from "../domain/users-service";
import {usersPassword} from "../auth-users/usersPasswords";

export const usersRouter = Router();

const loginLength = body("login").isLength({max: 10, min: 3}).withMessage("Не верная длина");
const passwordLength = body("password").isLength({min: 6, max: 20}).withMessage("Не верная длина");
const emailIsCorrect = body("email").isEmail().withMessage("Не верный ввод");
const aut = (req: Request, res: Response, next: NextFunction) => {
    if (req.headers.authorization === usersPassword[0]) {
        next();
    } else {
        res.sendStatus(401);
    }
};

usersRouter.get("/", async (req: Request, res: Response) => {
    const users = await queryRepository.getQueryUsers(req.query);
    res.send(users);
});

usersRouter.post("/", loginLength, passwordLength, emailIsCorrect, middleWare, aut, async (req: Request, res: Response) => {
    const newUser = await usersService.creatNewUsers(req.body.login, req.body.email, req.body.password);
    res.status(201).send(newUser);
});

usersRouter.delete("/:id", aut, async (req: Request, res: Response) => {
    const deleteUser = await usersService.deleteUser(req.params.id);
    if (deleteUser) {
        res.sendStatus(204);
    } else {
        res.sendStatus(404);
    }
});

