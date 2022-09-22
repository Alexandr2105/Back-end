import {Router, Request, Response} from "express";
import {postsRepository} from "../repositories/posts-repository";

export const postsRouters = Router();

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

postsRouters.post("/", (req: Request, res: Response) => {
    const post = postsRepository.createPost(req.body.title, req.body.shortDescription,
        req.body.content, req.body.blogId);
    res.send(post);
});

postsRouters.put("/:id", (req: Request, res: Response) => {
    const postUpdate = postsRepository.updatePostId(req.params.id, req.body.title, req.body.shortDescription,
        req.body.content, req.body.blogId);
    res.sendStatus(postUpdate);
});