import {Router, Request, Response} from "express";
import {QueryRepository} from "../queryReposytories/query";
import {body} from "express-validator";
import {aut, middleWare} from "../middlewares/middleware";
import {queryCheckHelper} from "../helper/queryCount";
import {UsersService} from "../domain/users-service";

export const usersRouter = Router();

const loginLength = body("login").isLength({max: 10, min: 3}).withMessage("Не верная длина");
const passwordLength = body("password").isLength({min: 6, max: 20}).withMessage("Не верная длина");
const emailIsCorrect = body("email").isEmail().withMessage("Не верный ввод");

class UsersController {
    private usersService: UsersService;
    private queryRepository:QueryRepository;

    constructor() {
        this.usersService = new UsersService();
        this.queryRepository=new QueryRepository();
    };

    async getUsers(req: Request, res: Response) {
        const query = queryCheckHelper(req.query);
        const users = await this.queryRepository.getQueryUsers(query);
        res.send(users);
    };

    async createUser(req: Request, res: Response) {
        const newUser = await this.usersService.creatNewUsers(req.body.login, req.body.email, req.body.password);
        const newUserId = await this.usersService.getUserById(newUser.id);
        res.status(201).send(newUserId);
    };

    async deleteUser(req: Request, res: Response) {
        const deleteUser = await this.usersService.deleteUser(req.params.id);
        if (deleteUser) {
            res.sendStatus(204);
        } else {
            res.sendStatus(404);
        }
    };
}

const usersController = new UsersController();

usersRouter.get("/", usersController.getUsers.bind(usersController));

usersRouter.post("/", aut, loginLength, passwordLength, emailIsCorrect, middleWare, usersController.createUser.bind(usersController));

usersRouter.delete("/:id", aut, usersController.deleteUser.bind(usersController));

