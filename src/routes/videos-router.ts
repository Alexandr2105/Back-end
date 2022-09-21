import {Request, Response, Router} from "express";
import {videosRepository} from "../repositories/video-repository";
import {middleWare} from "../middlewares/middleware";
import {body} from "express-validator";

export const videosRouter = Router();

const availableResolutions = ["P144", "P240", "P360", "P480", "P720", "P1080", "P1440", "P2160"];

const titleLength = body("title").trim().isLength({min: 1, max: 40}).withMessage("Не верно заполнено поле");
const authorLength = body("author").trim().isLength({min: 1, max: 20}).withMessage("Не верно заполнено поле");
const minAgeRestriction = body("minAgeRestriction").isInt({min: 1, max: 18}).withMessage("Не верно заполнено поле");
const canBeDownloaded = body("canBeDownloaded").isBoolean().withMessage("Не верно заполнено поле");
const publicationDate = body("publicationDate").trim().notEmpty().isLength({
    min: 24,
    max: 24
}).optional().withMessage("Не верно заполнено поле");
// const findAvailableResolutions = body("availableResolutions").trim().isIn(availableResolutions).withMessage("Не верно заполнено поле");
const findAvailableResolutions = (array: string[]) => {
    for (let s of array) {
        if (!availableResolutions.includes(s)) {
            return false;
        }
    }
    return true;
}

videosRouter.get("/", (req: Request, res: Response) => {
    const videos = videosRepository.getAllVideo();
    res.send(videos);
});

videosRouter.get("/:id", (req: Request, res: Response) => {
    let videoId = videosRepository.findVideosId(+req.params.id);
    if (videoId) {
        res.send(videoId);
    } else {
        res.sendStatus(404);
    }
});

videosRouter.delete("/:id", (req: Request, res: Response) => {
    let video = videosRepository.videoDelete(+req.params.id);
    if (video) {
        res.sendStatus(204);
    } else {
        res.sendStatus(404);
    }
});

videosRouter.post("/", titleLength, authorLength, middleWare, (req: Request, res: Response) => {
    const errors = [];
    if (!findAvailableResolutions(req.body.availableResolutions)) {
        errors.push({
                message: "Не верно заполнено поле",
                field: "availableResolutions"
            },
        );
        res.status(400).send({"errorsMessages":errors});
    } else {
        const newVideo = videosRepository.createVideo(req.body.title, req.body.author, req.body.availableResolutions);
        res.status(201).send(newVideo);
    }
});

videosRouter.put("/:id", titleLength, authorLength, minAgeRestriction, canBeDownloaded, publicationDate, middleWare, (req: Request, res: Response) => {
    const errors = [];
    if (!findAvailableResolutions(req.body.availableResolutions)) {
        errors.push([{
                message: "Не верно заполнено поле",
                field: "availableResolutions"
            }],
        );
        res.status(400).send(errors);
    } else {
        const updateVideo = videosRepository.updateVideo(+req.params.id, req.body.title,
            req.body.author, req.body.availableResolutions, req.body.canBeDownloaded,
            req.body.minAgeRestriction, req.body.publicationDate);
        res.sendStatus(updateVideo);
    }
});