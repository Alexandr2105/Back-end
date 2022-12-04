import {Router} from "express";
import {body} from "express-validator";
import {aut, checkToken, middleware} from "../middlewares/middleware";
import {blogsCollection} from "../db/db";
import {container} from "../composition-root";
import {PostsController} from "../controller-classes/posts-controller";

const postsController = container.resolve(PostsController);

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

postsRouter.get("/", postsController.getPosts.bind(postsController));
postsRouter.get("/:id", postsController.getPost.bind(postsController));
postsRouter.delete("/:id", aut, postsController.deletePost.bind(postsController));
postsRouter.post("/", aut, titleLength, shortDescriptionLength, contentLength, blogIdTrue, middleware, postsController.createPost.bind(postsController));
postsRouter.put("/:id", aut, titleLength, shortDescriptionLength, contentLength, blogIdTrue, middleware, postsController.updatePost.bind(postsController));
postsRouter.get("/:postId/comments", postsController.getCommentsForPost.bind(postsController));
postsRouter.post("/:postId/comments", checkToken, contentLengthByPostId, middleware, postsController.createCommentsForPost.bind(postsController));
postsRouter.put("/:postId/like-status", checkToken, checkLikeStatus, middleware, postsController.createLikeStatusForPost.bind(postsController));