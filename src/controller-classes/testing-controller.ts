import {TestingRepository} from "../repositories/testing-repository";
import {Request, Response} from "express";

export class TestingController {

    constructor(protected testingRepository: TestingRepository) {
    }

    async deleteAllBase(req: Request, res: Response) {
        await this.testingRepository.deleteAllCollection();
        res.sendStatus(204);
    };
}

