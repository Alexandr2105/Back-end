import {Request, Response, Router} from "express";
import {TestingRepository} from "../repositories/testing-repository";

export const testingRouter = Router();

class TestingController {
    private testingRepository: TestingRepository;

    constructor() {
        this.testingRepository = new TestingRepository();
    }

    async deleteAllBase(req: Request, res: Response) {
        await this.testingRepository.deleteAllCollection();
        res.sendStatus(204);
    };
}

const testingController = new TestingController();

testingRouter.delete("/all-data", testingController.deleteAllBase.bind(testingController));