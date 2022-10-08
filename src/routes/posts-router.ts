import {Router, Request, Response, NextFunction} from "express";
import {postsService} from "../domain/posts-service";
import {body} from "express-validator";
import {middleWare} from "../middlewares/middleware";
import {usersPassword} from "../auth-users/usersPasswords";
import {blogsCollection} from "../db/db";
import {queryRepository} from "../queryReposytories/query";

export const postsRouter = Router();

const titleLength = body("title").isLength({max: 30}).trim().notEmpty().withMessage("Не верно заполнено поле");
const shortDescriptionLength = body("shortDescription").isLength({max: 100}).trim().notEmpty().withMessage("Не верно заполнено поле");
const contentLength = body("content").isLength({max: 1000}).trim().notEmpty().withMessage("Не верно заполнено поле");
const blogIdTrue = body("blogId").custom(async (blogId) => {
    const id = await blogsCollection.findOne({id: blogId});
    if (id?.id === blogId) {
        return true;
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

postsRouter.get("/", async (req: Request, res: Response) => {
    // const posts = await postsService.getAllPosts();
    // res.send(posts);
    const posts = await queryRepository.getQueryPosts(req.query);
    res.send(posts);
});

postsRouter.get("/:id", async (req: Request, res: Response) => {
    const post = await postsService.getPostId(req.params.id);
    if (post) {
        res.send(post)
    } else {
        res.sendStatus(404);
    }
});

postsRouter.delete("/:id", aut, async (req: Request, res: Response) => {
    const postId = await postsService.deletePostId(req.params.id);
    if (postId) {
        res.sendStatus(204);
    } else {
        res.sendStatus(404);
    }
});

postsRouter.post("/", aut, titleLength, shortDescriptionLength, contentLength, blogIdTrue, middleWare,
    async (req: Request, res: Response) => {
        const createPost = await postsService.createPost(req.body.title, req.body.shortDescription,
            req.body.content, req.body.blogId);
        const newPost = await postsService.getPostId(createPost.id);
        res.status(201).send(newPost);
    });

postsRouter.put("/:id", aut, titleLength, shortDescriptionLength, contentLength, blogIdTrue, middleWare,
    async (req: Request, res: Response) => {
        const postUpdate = await postsService.updatePostId(req.params.id, req.body.title, req.body.shortDescription,
            req.body.content, req.body.blogId);
        if (postUpdate) {
            res.sendStatus(204);
        } else {
            res.sendStatus(404);
        }
    });