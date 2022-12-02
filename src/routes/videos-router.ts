import {Request, Response, Router} from "express";
import {middleWare} from "../middlewares/middleware";
import {body} from "express-validator";
import {VideosService} from "../domain/videos-service";

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
const findAvailableResolutions = (array: string[]) => {
    for (let s of array) {
        if (!availableResolutions.includes(s)) {
            return false;
        }
    }
    return true;
};

class VideosController {
    private videosService: VideosService;

    constructor() {
        this.videosService = new VideosService;
    }

    getVideos(req: Request, res: Response) {
        const videos = this.videosService.getAllVideo();
        res.send(videos);
    };

    getVideo(req: Request, res: Response) {
        let videoId = this.videosService.findVideosId(+req.params.id);
        if (videoId) {
            res.send(videoId);
        } else {
            res.sendStatus(404);
        }
    };

    deleteVideo(req: Request, res: Response) {
        let video = this.videosService.videoDelete(+req.params.id);
        if (video) {
            res.sendStatus(204);
        } else {
            res.sendStatus(404);
        }
    };

    createVideo(req: Request, res: Response) {
        const errors = [];
        if (!findAvailableResolutions(req.body.availableResolutions)) {
            errors.push({
                    message: "Не верно заполнено поле",
                    field: "availableResolutions"
                },
            );
            res.status(400).send({"errorsMessages": errors});
        } else {
            const newVideo = this.videosService.createVideo(req.body.title, req.body.author, req.body.availableResolutions);
            res.status(201).send(newVideo);
        }
    };

    updateVideo(req: Request, res: Response) {
        const errors = [];
        if (!findAvailableResolutions(req.body.availableResolutions)) {
            errors.push({
                    message: "Не верно заполнено поле",
                    field: "availableResolutions"
                },
            );
            res.status(400).send({"errorsMessages": errors});
        } else {
            const updateVideo = this.videosService.updateVideo(+req.params.id, req.body.title,
                req.body.author, req.body.availableResolutions, req.body.canBeDownloaded,
                req.body.minAgeRestriction, req.body.publicationDate);
            res.sendStatus(updateVideo);
        }
    };
}

const videoController = new VideosController();

videosRouter.get("/", videoController.getVideos.bind(videoController));
videosRouter.get("/:id", videoController.getVideo.bind(videoController));
videosRouter.delete("/:id", videoController.deleteVideo.bind(videoController));
videosRouter.post("/", titleLength, authorLength, middleWare, videoController.createVideo.bind(videoController));
videosRouter.put("/:id", titleLength, authorLength, minAgeRestriction, canBeDownloaded, publicationDate, middleWare, videoController.updateVideo.bind(videoController));