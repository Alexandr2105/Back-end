import {Router, Request, Response} from "express";
import {blogsRepository} from "../repositories/blogs-repository";
import {body} from "express-validator";
import {middleWare} from "../middlewares/middleware";
import {usersPassword} from "../repositories/usersPasswords";

export const blogsRouters = Router();

const nameLength = body("name").isLength({max: 15}).withMessage("Не верно заполнено поле");
const urlLength = body("youtubeUrl").isLength({max: 100}).isURL({}).withMessage("Не верно заполнено поле");

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
    const aut = usersPassword[0] === req.headers.authorization ? true : res.sendStatus(401);
    const blogsDelId = blogsRepository.deleteBlogsId(req.params.id);
    if (blogsDelId) {
        res.sendStatus(204);
    } else {
        res.sendStatus(404);
    }
});

blogsRouters.post("/", nameLength, urlLength, middleWare, (req: Request, res: Response) => {
    const aut = usersPassword[0] === req.headers.authorization ? true : res.sendStatus(401);
    const createBlogs = blogsRepository.createBlog(req.body.name, req.body.youtubeUrl);
    res.send(createBlogs).status(201);
});

blogsRouters.put("/:id", nameLength, urlLength, middleWare, (req: Request, res: Response) => {
    const aut = usersPassword[0] === req.headers.authorization ? true : res.sendStatus(401);
    const updateBlog = blogsRepository.updateBlog(req.params.id, req.body.name, req.body.youtubeUrl);
    res.sendStatus(updateBlog);
});