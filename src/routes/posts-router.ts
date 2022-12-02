import {Router, Request, Response} from "express";
import {PostsService} from "../domain/posts-service";
import {body} from "express-validator";
import {aut, checkToken, middleWare} from "../middlewares/middleware";
import {blogsCollection} from "../db/db";
import {QueryRepository} from "../queryReposytories/query";
import {queryCheckHelper} from "../helper/queryCount";
import {CommentsService} from "../domain/comments-service";
import {JwtService} from "../application/jwt-service";
import {UsersRepository} from "../repositories/users-repository";
import {PostsRepository} from "../repositories/posts-repository";

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
const checkLikeStatus = body("likeStatus").custom(status => {
    if (status === "None" || status === "Like" || status === "Dislike") {
        return true;
    } else {
        throw new Error("Не верный стус");
    }
});

class PostsController {
    private postsService: PostsService;
    private usersRepository: UsersRepository;
    private postsRepository: PostsRepository;
    private commentsService: CommentsService;
    private queryRepository: QueryRepository;
    private jwtService: JwtService;

    constructor() {
        this.postsService = new PostsService();
        this.usersRepository = new UsersRepository();
        this.postsRepository = new PostsRepository();
        this.commentsService = new CommentsService();
        this.queryRepository = new QueryRepository();
        this.jwtService = new JwtService();
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

const postsController = new PostsController();

postsRouter.get("/", postsController.getPosts.bind(postsController));
postsRouter.get("/:id", postsController.getPost.bind(postsController));
postsRouter.delete("/:id", aut, postsController.deletePost.bind(postsController));
postsRouter.post("/", aut, titleLength, shortDescriptionLength, contentLength, blogIdTrue, middleWare, postsController.createPost.bind(postsController));
postsRouter.put("/:id", aut, titleLength, shortDescriptionLength, contentLength, blogIdTrue, middleWare, postsController.updatePost.bind(postsController));
postsRouter.get("/:postId/comments", postsController.getCommentsForPost.bind(postsController));
postsRouter.post("/:postId/comments", checkToken, contentLengthByPostId, middleWare, postsController.createCommentsForPost.bind(postsController));
postsRouter.put("/:postId/like-status", checkToken, checkLikeStatus, middleWare, postsController.createLikeStatusForPost.bind(postsController));