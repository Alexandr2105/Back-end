import {QueryRepository} from "../queryReposytories/query-Repository";
import {UsersService} from "../domain/users-service";
import {Request, Response} from "express";
import {queryCheckHelper} from "../helper/queryCount";
import {inject, injectable} from "inversify";

@injectable()
export class UsersController {

    constructor(@inject(UsersService) protected usersService: UsersService,
                @inject(QueryRepository) protected queryRepository: QueryRepository) {
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

