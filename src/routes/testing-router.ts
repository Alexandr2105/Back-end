import {Request, Response, Router} from "express";
import {testingRepository} from "../repositories/testing-repository";

export const testingRouter = Router();

class TestingController {
    async deleteAllBase(req: Request, res: Response) {
        await testingRepository.deleteAllCollection();
        res.sendStatus(204);
    };
}

const testingController = new TestingController();

testingRouter.delete("/all-data", testingController.deleteAllBase);