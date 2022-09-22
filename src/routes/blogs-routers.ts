import {Router, Request, Response} from "express";
import {blogsRepository} from "../repositories/blogs-repository";
import {body} from "express-validator";
import {middleWare} from "../middlewares/middleware";

export const blogsRouters = Router();

const nameLength=body("name").isLength({max:15});
const urlLength=body("youtubeUrl").isLength({max:100}).isURL({});

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

blogsRouters.delete("/:id", (req: Request, res: Response) => {
    const blogsDelId = blogsRepository.deleteBlogsId(req.params.id);
    if (blogsDelId) {
        res.sendStatus(204);
    } else {
        res.sendStatus(404);
    }
});

blogsRouters.post("/", nameLength,urlLength,middleWare,(req: Request, res: Response) => {
    const createBlogs = blogsRepository.createBlog(req.body.name, req.body.youtubeUrl);
    res.send(createBlogs).status(201);
});

blogsRouters.put("/:id",nameLength,urlLength,middleWare, (req: Request, res: Response) => {
    const updateBlog = blogsRepository.updateBlog(req.params.id, req.body.name, req.body.youtubeUrl);
    res.sendStatus(updateBlog);
});