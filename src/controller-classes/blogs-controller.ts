import {PostsService} from "../domain/posts-service";
import {QueryRepository} from "../queryReposytories/QueryRepository";
import {JwtService} from "../application/jwt-service";
import {BlogsService} from "../domain/blogs-service";
import {Request, Response} from "express";
import {queryCheckHelper} from "../helper/queryCount";

export class BlogsController {
    constructor(protected blogsService: BlogsService,
                protected postsService: PostsService,
                protected queryRepository: QueryRepository,
                protected jwtService: JwtService) {
    };

    async getBlogs(req: Request, res: Response) {
        const query = queryCheckHelper(req.query);
        const blogs = await this.queryRepository.getQueryBlogs(query);
        res.send(blogs);
    };

    async getBlog(req: Request, res: Response) {
        const blogsId = await this.blogsService.getBlogsId(req.params.id);
        if (blogsId) {
            res.send(blogsId);
        } else {
            res.sendStatus(404);
        }
    };

    async deleteBlog(req: Request, res: Response) {
        const blogsDelId = await this.blogsService.deleteBlogsId(req.params.id);
        if (blogsDelId) {
            res.sendStatus(204);
        } else {
            res.sendStatus(404);
        }
    };

    async createBlog(req: Request, res: Response) {
        const createBlog = await this.blogsService.createBlog(req.body.name, req.body.websiteUrl, req.body.description);
        const newBlog = await this.blogsService.getBlogsId(createBlog.id);
        res.status(201).send(newBlog);
    };

    async updateBlog(req: Request, res: Response) {
        const updateBlog = await this.blogsService.updateBlog(req.params.id, req.body.name, req.body.websiteUrl);
        if (updateBlog) {
            res.sendStatus(204);
        } else {
            res.sendStatus(404);
        }
    };

    async getPostsForBlog(req: Request, res: Response) {
        let postsBlogId;
        const query = queryCheckHelper(req.query);
        if (req.headers.authorization) {
            const userId: any = this.jwtService.getUserIdByToken(req.headers.authorization!.split(" ")[1]);
            postsBlogId = await this.queryRepository.getQueryPostsBlogsId(query, req.params.blogId, userId);
        } else {
            postsBlogId = await this.queryRepository.getQueryPostsBlogsId(query, req.params.blogId, "null");
        }
        if (postsBlogId.items.length !== 0) {
            res.send(postsBlogId);
        } else {
            res.sendStatus(404);
        }
    };

    async createPostsForBlog(req: Request, res: Response) {
        const newPostForBlogId = await this.postsService.createPost(req.body.title, req.body.shortDescription, req.body.content, req.params.blogId);
        if (newPostForBlogId) {
            const newPost = await this.postsService.getPostId(newPostForBlogId.id, "null");
            res.status(201).send(newPost);
        } else {
            res.sendStatus(404);
        }
    };
}