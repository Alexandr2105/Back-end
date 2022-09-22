import {Router, Request, Response} from "express";
import {blogsRepository} from "../repositories/blogs-repository";

export const blogsRouters = Router();

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

blogsRouters.post("/", (req: Request, res: Response) => {
    const createBlogs = blogsRepository.createBlog(req.body.name, req.body.youtubeUrl);
    res.send(createBlogs).status(201);
});

blogsRouters.put("/:id", (req: Request, res: Response) => {
   const updateBlog=blogsRepository.updateBlog(req.params.id,req.body.name,req.body.youtubeUrl);
   res.send(updateBlog);
});