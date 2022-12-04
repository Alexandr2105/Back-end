import {UsersRepository} from "../repositories/users-repository";
import {PostsRepository} from "../repositories/posts-repository";
import {CommentsService} from "../domain/comments-service";
import {QueryRepository} from "../queryReposytories/query-Repository";
import {JwtService} from "../application/jwt-service";
import {PostsService} from "../domain/posts-service";
import {Request, Response} from "express";
import {queryCheckHelper} from "../helper/queryCount";
import {inject, injectable} from "inversify";

@injectable()
export class PostsController {

    constructor(@inject(PostsService) protected postsService: PostsService,
                @inject(UsersRepository) protected usersRepository: UsersRepository,
                @inject(PostsRepository) protected postsRepository: PostsRepository,
                @inject(CommentsService) protected commentsService: CommentsService,
                @inject(QueryRepository) protected queryRepository: QueryRepository,
                @inject(JwtService) protected jwtService: JwtService) {
    };

    async getPosts(req: Request, res: Response) {
        let post;
        const query = queryCheckHelper(req.query);
        if (req.headers.authorization) {
            const userId: any = this.jwtService.getUserIdByToken(req.headers.authorization!.split(" ")[1]);
            post = await this.queryRepository.getQueryPosts(query, userId.toString());
        } else {
            post = await this.queryRepository.getQueryPosts(query, "null");
        }
        res.send(post);
    };

    async getPost(req: Request, res: Response) {
        let post;
        if (req.headers.authorization) {
            const userId: any = this.jwtService.getUserIdByToken(req.headers.authorization!.split(" ")[1]);
            post = await this.postsService.getPostId(req.params.id, userId.toString());
        } else {
            post = await this.postsService.getPostId(req.params.id, "null");
        }
        if (post) {
            res.send(post);
        } else {
            res.sendStatus(404);
        }
    };

    async deletePost(req: Request, res: Response) {
        const postId = await this.postsService.deletePostId(req.params.id);
        if (postId) {
            res.sendStatus(204);
        } else {
            res.sendStatus(404);
        }
    };

    async createPost(req: Request, res: Response) {
        const createPost = await this.postsService.createPost(req.body.title, req.body.shortDescription,
            req.body.content, req.body.blogId);
        const newPost = await this.postsService.getPostId(createPost.id, "null");
        res.status(201).send(newPost);
    };

    async updatePost(req: Request, res: Response) {
        const postUpdate = await this.postsService.updatePostId(req.params.id, req.body.title, req.body.shortDescription,
            req.body.content, req.body.blogId);
        if (postUpdate) {
            res.sendStatus(204);
        } else {
            res.sendStatus(404);
        }
    };

    async getCommentsForPost(req: Request, res: Response) {
        const query = queryCheckHelper(req.query);
        const comments = await this.queryRepository.getQueryCommentsByPostId(query, req.params.postId);
        if (comments) {
            res.send(comments);
        } else {
            res.sendStatus(404);
        }
    };

    async createCommentsForPost(req: Request, res: Response) {
        const post: any = await this.postsService.creatNewCommentByPostId(req.params.postId, req.body.content, req.user!.id, req.user!.login);
        const userId: any = await this.jwtService.getUserIdByToken(req.headers.authorization!.split(" ")[1]);
        if (post) {
            const newPost = await this.commentsService.getLikesInfo(post.id, userId.toString());
            res.status(201).send(newPost);
        } else {
            res.sendStatus(404);
        }
    };

    async createLikeStatusForPost(req: Request, res: Response) {
        const postId = await this.postsRepository.getPostId(req.params.postId);
        if (!postId) {
            res.sendStatus(404);
            return;
        }
        const userId = await this.jwtService.getUserIdByToken(req.headers.authorization!.split(" ")[1]);
        const user: any = await this.usersRepository.getUserId(userId!.toString());
        const likeStatus = await this.postsService.createLikeStatus(req.params.postId, userId!.toString(), req.body.likeStatus, user.login);
        if (likeStatus) {
            res.sendStatus(204);
        }
    };
}