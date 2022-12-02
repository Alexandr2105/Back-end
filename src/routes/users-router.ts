import {Router, Request, Response} from "express";
import {queryRepository} from "../queryReposytories/query";
import {body} from "express-validator";
import {aut, middleWare} from "../middlewares/middleware";
import {usersService} from "../domain/users-service";
import {queryCheckHelper} from "../helper/queryCount";

export const usersRouter = Router();

const loginLength = body("login").isLength({max: 10, min: 3}).withMessage("Не верная длина");
const passwordLength = body("password").isLength({min: 6, max: 20}).withMessage("Не верная длина");
const emailIsCorrect = body("email").isEmail().withMessage("Не верный ввод");

class UsersController {
    async getUsers(req: Request, res: Response) {
        const query = queryCheckHelper(req.query);
        const users = await queryRepository.getQueryUsers(query);
        res.send(users);
    };

    async createUser(req: Request, res: Response) {
        const newUser = await usersService.creatNewUsers(req.body.login, req.body.email, req.body.password);
        const newUserId = await usersService.getUserById(newUser.id);
        res.status(201).send(newUserId);
    };

    async deleteUser(req: Request, res: Response) {
        const deleteUser = await usersService.deleteUser(req.params.id);
        if (deleteUser) {
            res.sendStatus(204);
        } else {
            res.sendStatus(404);
        }
    };
}

const usersController = new UsersController();

usersRouter.get("/", usersController.getUsers);

usersRouter.post("/", aut, loginLength, passwordLength, emailIsCorrect, middleWare, usersController.createUser);

usersRouter.delete("/:id", aut, usersController.deleteUser);

