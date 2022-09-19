import {Request, Response, Router} from "express";
import {videosRepository} from "../repositories/video-repository";

export const videosRouter = Router();

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

videosRouter.post("/", (req: Request, res: Response) => {
    const newVideo = videosRepository.createVideo(req.body.title, req.body.author, req.body.availableResolutions);
    res.status(201).send(newVideo);
});

videosRouter.put("/:id", (req: Request, res: Response) => {
    const updateVideo=videosRepository.updateVideo(+req.params.id,req.body.author,
        req.body.author,req.body.availableResolutions,req.body.canBeDownloaded,
        req.body.minAgeRestriction,req.body.publicationDate);
    res.sendStatus(updateVideo);
});