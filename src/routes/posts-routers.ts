import {Router, Request, Response} from "express";
import {postsRepository} from "../repositories/posts-repository";
import {body} from "express-validator";
import {blogs} from "../repositories/blogs-repository";
import {middleWare} from "../middlewares/middleware";

export const postsRouters = Router();

const titleLength=body("title").isLength({max:30});
const shortDescriptionLength=body("shortDescription").isLength({max:100});
const contentLength=body("content").isLength({max:1000});
const blogIdTrue=body("id").custom((b,{req})=>{
    for (let blog of blogs) {
        if(blog.id===req.body.blogId){
            return true;
        }
    }throw new Error("Нет такого id");
});

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

postsRouters.delete("/:id", (req: Request, res: Response) => {
    const postId = postsRepository.deletePostId(req.params.id);
    if (postId) {
        res.sendStatus(204);
    } else {
        res.sendStatus(404);
    }
});

postsRouters.post("/", titleLength,shortDescriptionLength,contentLength,blogIdTrue,middleWare,
    (req: Request, res: Response) => {
    const post = postsRepository.createPost(req.body.title, req.body.shortDescription,
        req.body.content, req.body.blogId);
    res.send(post);
});

postsRouters.put("/:id", titleLength,shortDescriptionLength,contentLength,blogIdTrue,middleWare,
    (req: Request, res: Response) => {
    const postUpdate = postsRepository.updatePostId(req.params.id, req.body.title, req.body.shortDescription,
        req.body.content, req.body.blogId);
    res.sendStatus(postUpdate);
});