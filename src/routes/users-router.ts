import {Router} from "express";
import {body} from "express-validator";
import {aut, middleware} from "../middlewares/middleware";
import {usersController} from "../composition-root";

export const usersRouter = Router();

const loginLength = body("login").isLength({max: 10, min: 3}).withMessage("Не верная длина");
const passwordLength = body("password").isLength({min: 6, max: 20}).withMessage("Не верная длина");
const emailIsCorrect = body("email").isEmail().withMessage("Не верный ввод");

usersRouter.get("/", usersController.getUsers.bind(usersController));

usersRouter.post("/", aut, loginLength, passwordLength, emailIsCorrect, middleware, usersController.createUser.bind(usersController));

usersRouter.delete("/:id", aut, usersController.deleteUser.bind(usersController));

