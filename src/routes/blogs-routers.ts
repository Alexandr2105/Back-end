import {Router, Request, Response, NextFunction} from "express";
import {body} from "express-validator";
import {middleWare} from "../middlewares/middleware";
import {usersPassword} from "../repositories/usersPasswords";
import {blogsService} from "../domain/blogs-service";
import {queryRepository} from "../queryReposytories/query";
import {postsService} from "../domain/posts-service";
import {blogsCollection} from "../db/db";

export const blogsRouters = Router();

const nameLength = body("name").isLength({max: 15}).withMessage("Длина больше 15 символов").trim().notEmpty().withMessage("Это поле должно быть заплнено");
const urlLength = body("youtubeUrl").isLength({max: 100}).trim().notEmpty().isURL().withMessage("Не верно заполнено поле");
const aut = (req: Request, res: Response, next: NextFunction) => {
    if (req.headers.authorization === usersPassword[0]) {
        next();
    } else {
        res.sendStatus(401);
    }
}
const titleLength = body("title").trim().notEmpty().isLength({max: 30}).withMessage("Не верно заполнено поле");
const shortDescriptionLength = body("shortDescription").trim().notEmpty().isLength({max: 100}).withMessage("Не верно заполнено поле");
const contentLength = body("content").trim().notEmpty().isLength({max: 1000}).withMessage("Не верно заполнено поле");
const trueId = async (req: Request, res: Response, next: NextFunction) => {
    const id = await blogsCollection.findOne({id: req.params.blogId});
    if (id?.id === req.params.blogId) {
        next();
    } else {
        res.sendStatus(404);
    }
}

blogsRouters.get("/", async (req: Request, res: Response) => {
    // const blogs = await blogsService.getAllBlogs();
    // res.send(blogs);
    const blogs = await queryRepository.getQueryBlogs(req.query);
    res.send(blogs);
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

blogsRouters.get("/:blogId/posts", async (req: Request, res: Response) => {
    const postsBlogId = await queryRepository.getQueryPostsBlogsId(req.query, req.params.blogId);
    if (postsBlogId.items.length !== 0) {
        res.send(postsBlogId);
    } else {
        res.sendStatus(404);
    }
});

blogsRouters.post("/:blogId/posts", aut, titleLength, shortDescriptionLength, contentLength, trueId, middleWare, async (req: Request, res: Response) => {
    const newPostForBlogId = await postsService.createPost(req.body.title, req.body.shortDescription, req.body.content, req.params.blogId);
    if (newPostForBlogId) {
        const newPost = await postsService.getPostId(newPostForBlogId.id);
        res.status(201).send(newPost);
    } else {
        res.sendStatus(404);
    }
});