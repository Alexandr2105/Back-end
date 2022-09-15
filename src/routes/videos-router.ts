import {Request, Response, Router} from "express";

export const videosRouter = Router();

const videos = [
    {
        id: 0,
        title: "video-00",
        author: "Alex",
        canBeDownloaded: true,
        minAgeRestriction: null,
        createdAt: new Date().toISOString(),
        publicationDate: new Date().toISOString(),
        availableResolutions: [
            "P144"
        ]
    }, {
        id: 1,
        title: "video-01",
        author: "Alex",
        canBeDownloaded: true,
        minAgeRestriction: null,
        createdAt: new Date().toISOString(),
        publicationDate: new Date().toISOString(),
        availableResolutions: [
            "P144"
        ]
    },
    {
        id: 2,
        title: "video-02",
        author: "Alex",
        canBeDownloaded: true,
        minAgeRestriction: null,
        createdAt: new Date().toISOString(),
        publicationDate: new Date().toISOString(),
        availableResolutions: [
            "P144"
        ]
    }
];

videosRouter.get("/", (req: Request, res: Response) => {
    res.send(videos);
});

videosRouter.get("/:id", (req: Request, res: Response) => {
    let id = videos.find(p => p.id === +req.params.id);
    if (id) {
        res.send(id);
    } else {
        res.send(404);
    }
});

videosRouter.delete("/:id", (req: Request, res: Response) => {
    for (let a = 0; a < videos.length; a++) {
        if (videos[a].id === +req.params.id) {
            videos.splice(a, 1);
            res.send(204);
            return;
        }
    }
    res.send(404);
});

// videosRouter.post("/",(req:Request,res:Response)=>{});