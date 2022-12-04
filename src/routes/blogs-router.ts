import {NextFunction, Request, Response, Router} from "express";
import {body} from "express-validator";
import {aut, middleware} from "../middlewares/middleware";
import {blogsCollection} from "../db/db";
import {container} from "../composition-root";
import {BlogsController} from "../controller-classes/blogs-controller";

const blogsController = container.resolve(BlogsController);

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

blogsRouter.get("/", blogsController.getBlogs.bind(blogsController));
blogsRouter.get("/:id", blogsController.getBlog.bind(blogsController));
blogsRouter.delete("/:id", aut, blogsController.deleteBlog.bind(blogsController));
blogsRouter.post("/", aut, nameLength, urlLength, description, middleware, blogsController.createBlog.bind(blogsController));
blogsRouter.put("/:id", aut, nameLength, urlLength, middleware, blogsController.updateBlog.bind(blogsController));
blogsRouter.get("/:blogId/posts", blogsController.getPostsForBlog.bind(blogsController));
blogsRouter.post("/:blogId/posts", aut, titleLength, shortDescriptionLength, contentLength, trueId, middleware, blogsController.createPostsForBlog.bind(blogsController));