import {Router, Request, Response} from "express";
import {postsService} from "../domain/posts-service";
import {body} from "express-validator";
import {aut, checkToken, middleWare} from "../middlewares/middleware";
import {blogsCollection} from "../db/db";
import {queryRepository} from "../queryReposytories/query";
import {queryCheckHelper} from "../helper/queryCount";
import {commentService} from "../domain/comment-service";

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
const contentLengthByPostId = body("content").isLength({
    min: 20,
    max: 300
}).withMessage("Неверная длинна поля");

postsRouter.get("/", async (req: Request, res: Response) => {
    const query = queryCheckHelper(req.query);
    const posts = await queryRepository.getQueryPosts(query);
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

postsRouter.get("/:postId/comments", async (req: Request, res: Response) => {
    const query = queryCheckHelper(req.query);
    const comments = await queryRepository.getQueryCommentsByPostId(query, req.params.postId);
    if (comments) {
        res.status(200).send(comments);
    } else {
        res.sendStatus(404);
    }
});

postsRouter.post("/:postId/comments", checkToken, contentLengthByPostId, middleWare, async (req: Request, res: Response) => {
    const post = await postsService.creatNewCommentByPostId(req.params.postId, req.body.content, req.user!.id, req.user!.login);
    const newPost = await commentService.getCommentById(post.id);
    res.send(newPost);
});