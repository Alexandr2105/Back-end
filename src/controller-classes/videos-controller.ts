import {VideosService} from "../domain/videos-service";
import {Request, Response} from "express";
import {findAvailableResolutions} from "../routes/videos-router";

export class VideosController {

    constructor(protected videosService: VideosService) {
    };

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

