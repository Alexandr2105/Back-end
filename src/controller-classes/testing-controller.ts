import {TestingRepository} from "../repositories/testing-repository";
import {Request, Response} from "express";
import {inject, injectable} from "inversify";

@injectable()
export class TestingController {

    constructor(@inject(TestingRepository) protected testingRepository: TestingRepository) {
    };

    async deleteAllBase(req: Request, res: Response) {
        await this.testingRepository.deleteAllCollection();
        res.sendStatus(204);
    };
}

