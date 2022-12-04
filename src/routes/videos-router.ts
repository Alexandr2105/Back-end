import {Router} from "express";
import {middleware} from "../middlewares/middleware";
import {body} from "express-validator";
import {container} from "../composition-root";
import {VideosController} from "../controller-classes/videos-controller";

const videoController = container.resolve(VideosController);

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
export const findAvailableResolutions = (array: string[]) => {
    for (let s of array) {
        if (!availableResolutions.includes(s)) {
            return false;
        }
    }
    return true;
};

videosRouter.get("/", videoController.getVideos.bind(videoController));
videosRouter.get("/:id", videoController.getVideo.bind(videoController));
videosRouter.delete("/:id", videoController.deleteVideo.bind(videoController));
videosRouter.post("/", titleLength, authorLength, middleware, videoController.createVideo.bind(videoController));
videosRouter.put("/:id", titleLength, authorLength, minAgeRestriction, canBeDownloaded, publicationDate, middleware, videoController.updateVideo.bind(videoController));