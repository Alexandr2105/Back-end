import {Router, Request, Response} from "express";
import {queryRepository} from "../queryReposytories/query";
import {body} from "express-validator";
import {middleWare} from "../middlewares/middleware";
import {usersService} from "../domain/users-service";

export const usersRouter = Router();

const loginLength = body("login").isLength({max: 10, min: 3}).withMessage("Не верная длина");
const passwordLength = body("password").isLength({min: 6, max: 20}).withMessage("Не верная длина");
const emailIsCorrect = body("email").isEmail().withMessage("Не верный ввод");

usersRouter.get("/", async (req: Request, res: Response) => {
    const users = await queryRepository.getQueryUsers(req.query);
    res.send(users);
});

usersRouter.post("/", loginLength, passwordLength, emailIsCorrect, middleWare, async (req: Request, res: Response) => {
    const newUser = await usersService.creatNewUsers(req.body.login, req.body.email);
    res.status(201).send(newUser);
});

usersRouter.delete("/:id", async (req: Request, res: Response) => {
    const deleteUser = await usersService.deleteUser(req.params.id);
    if (deleteUser) {
        res.sendStatus(204);
    } else {
        res.sendStatus(404);
    }
});
