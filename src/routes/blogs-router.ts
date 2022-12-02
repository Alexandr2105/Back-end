import {Router, Request, Response, NextFunction} from "express";
import {body} from "express-validator";
import {aut, middleWare} from "../middlewares/middleware";
import {BlogsService} from "../domain/blogs-service";
import {QueryRepository} from "../queryReposytories/query";
import {PostsService} from "../domain/posts-service";
import {blogsCollection} from "../db/db";
import {queryCheckHelper} from "../helper/queryCount";
import {JwtService} from "../application/jwt-service";

export const blogsRouter = Router();

const nameLength = body("name").isLength({max: 15}).withMessage("Длина больше 15 символов").trim().notEmpty().withMessage("Это поле должно быть заплнено");
const urlLength = body("websiteUrl").isLength({max: 100}).trim().notEmpty().isURL().withMessage("Не верно заполнено поле");
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
};
const description = body("description").trim().notEmpty().isLength({max: 500}).withMessage("Не верно заполнено поле");

class BlogsController {
    private blogsService: BlogsService;
    private postsService: PostsService;
    private queryRepository: QueryRepository;
    private jwtService: JwtService;

    constructor() {
        this.blogsService = new BlogsService();
        this.postsService = new PostsService();
        this.queryRepository = new QueryRepository();
        this.jwtService = new JwtService();
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

const blogsController = new BlogsController();

blogsRouter.get("/", blogsController.getBlogs.bind(blogsController));
blogsRouter.get("/:id", blogsController.getBlog.bind(blogsController));
blogsRouter.delete("/:id", aut, blogsController.deleteBlog.bind(blogsController));
blogsRouter.post("/", aut, nameLength, urlLength, description, middleWare, blogsController.createBlog.bind(blogsController));
blogsRouter.put("/:id", aut, nameLength, urlLength, middleWare, blogsController.updateBlog.bind(blogsController));
blogsRouter.get("/:blogId/posts", blogsController.getPostsForBlog.bind(blogsController));
blogsRouter.post("/:blogId/posts", aut, titleLength, shortDescriptionLength, contentLength, trueId, middleWare, blogsController.createPostsForBlog.bind(blogsController));