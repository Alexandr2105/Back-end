import {Router, Request, Response, NextFunction} from "express";
import {blogsRepository} from "../repositories/blogs-repository";
import {body} from "express-validator";
import {middleWare} from "../middlewares/middleware";
import {usersPassword} from "../repositories/usersPasswords";

export const blogsRouters = Router();

const nameLength = body("name").trim().notEmpty().isLength({max: 15}).withMessage("Не верно заполнено поле");
const urlLength = body("youtubeUrl").trim().notEmpty().isLength({max: 100}).isURL({}).withMessage("Не верно заполнено поле");
const aut = (req: Request, res: Response, next: NextFunction) => {
    if (req.headers.authorization === usersPassword[0]) {
        next();
    } else {
        res.sendStatus(401);
    }
}

blogsRouters.get("/", (req: Request, res: Response) => {
    const blogs = blogsRepository.getAllBlogs();
    res.send(blogs);
});

blogsRouters.get("/:id", (req: Request, res: Response) => {
    const blogsId = blogsRepository.getBlogsId(req.params.id);
    if (blogsId) {
        res.send(blogsId);
    } else {
        res.sendStatus(404);
    }
});

blogsRouters.delete("/:id", aut, (req: Request, res: Response) => {
    const blogsDelId = blogsRepository.deleteBlogsId(req.params.id);
    if (blogsDelId) {
        res.sendStatus(204);
    } else {
        res.sendStatus(404);
    }
});

blogsRouters.post("/", aut, nameLength, urlLength, middleWare, (req: Request, res: Response) => {
    const createBlogs = blogsRepository.createBlog(req.body.name, req.body.youtubeUrl);
    res.status(201).send(createBlogs);
});

blogsRouters.put("/:id", aut, nameLength, urlLength, middleWare, (req: Request, res: Response) => {
    const updateBlog = blogsRepository.updateBlog(req.params.id, req.body.name, req.body.youtubeUrl);
    res.sendStatus(updateBlog);
});