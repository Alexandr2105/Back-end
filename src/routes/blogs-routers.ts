import {Router, Request, Response, NextFunction} from "express";
import {body} from "express-validator";
import {middleWare} from "../middlewares/middleware";
import {usersPassword} from "../repositories/usersPasswords";
import {blogsService} from "../domain/blogs-service";
// import {queryRepository} from "../queryReposytories/query";

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

blogsRouters.get("/", async (req: Request, res: Response) => {
    const blogs = await blogsService.getAllBlogs();
    res.send(blogs);
    // const blogs=await queryRepository.getQueryBlogs(req.query);
    // res.send(blogs);
});

blogsRouters.get("/:id", async (req: Request, res: Response) => {
    const blogsId = await blogsService.getBlogsId(req.params.id);
    if (blogsId) {
        res.send(blogsId);
    } else {
        res.sendStatus(404);
    }
});

blogsRouters.delete("/:id", aut, async (req: Request, res: Response) => {
    const blogsDelId = await blogsService.deleteBlogsId(req.params.id);
    if (blogsDelId) {
        res.sendStatus(204);
    } else {
        res.sendStatus(404);
    }
});

blogsRouters.post("/", aut, nameLength, urlLength, middleWare, async (req: Request, res: Response) => {
    const createBlog = await blogsService.createBlog(req.body.name, req.body.youtubeUrl);
    const newBlog = await blogsService.getBlogsId(createBlog.id);
    res.status(201).send(newBlog);
});

blogsRouters.put("/:id", aut, nameLength, urlLength, middleWare, async (req: Request, res: Response) => {
    const updateBlog = await blogsService.updateBlog(req.params.id, req.body.name, req.body.youtubeUrl);
    if (updateBlog) {
        res.sendStatus(204);
    } else {
        res.sendStatus(404);
    }
});

// blogsRouters.get("/:blogId/posts", (req: Request, res: Response) => {
//     queryRepository.getQueryBlogs(req.query);
// });

// blogsRouters.post("/:blogId/posts", (req: Request, res: Response) => {
//
// });