import {Router, Request, Response, NextFunction} from "express";
import {postsRepository} from "../repositories/posts-repository";
import {body} from "express-validator";
import {blogs} from "../repositories/blogs-in-memory-repository";
import {middleWare} from "../middlewares/middleware";
import {usersPassword} from "../repositories/usersPasswords";

export const postsRouters = Router();

const titleLength = body("title").trim().notEmpty().isLength({max: 30}).withMessage("Не верно заполнено поле");
const shortDescriptionLength = body("shortDescription").trim().notEmpty().isLength({max: 100}).withMessage("Не верно заполнено поле");
const contentLength = body("content").isLength({max: 1000}).trim().notEmpty().withMessage("Не верно заполнено поле");
const blogIdTrue = body("blogId").custom((b, {req}) => {
    for (let blog of blogs) {
        if (blog.id === req.body.blogId) {
            return true;
        }
    }
    throw new Error("Нет такого id");
});
const aut = (req: Request, res: Response, next: NextFunction) => {
    if (req.headers.authorization === usersPassword[0]) {
        next();
    } else {
        res.sendStatus(401);
    }
}

postsRouters.get("/", (req: Request, res: Response) => {
    const posts = postsRepository.getAllPosts();
    res.send(posts);
});

postsRouters.get("/:id", (req: Request, res: Response) => {
    const post = postsRepository.getPostId(req.params.id);
    if (post) {
        res.send(post)
    } else {
        res.sendStatus(404);
    }
});

postsRouters.delete("/:id", aut, (req: Request, res: Response) => {
    const postId = postsRepository.deletePostId(req.params.id);
    if (postId) {
        res.sendStatus(204);
    } else {
        res.sendStatus(404);
    }
});

postsRouters.post("/", aut, titleLength, shortDescriptionLength, contentLength, blogIdTrue, middleWare,
    (req: Request, res: Response) => {
        const post = postsRepository.createPost(req.body.title, req.body.shortDescription,
            req.body.content, req.body.blogId);
        res.status(201).send(post);
    });

postsRouters.put("/:id", aut, titleLength, shortDescriptionLength, contentLength, blogIdTrue, middleWare,
    (req: Request, res: Response) => {
        const postUpdate = postsRepository.updatePostId(req.params.id, req.body.title, req.body.shortDescription,
            req.body.content, req.body.blogId);
        if (postUpdate) {
            res.sendStatus(204);
        } else {
            res.sendStatus(404);
        }
    });