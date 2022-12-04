import {NextFunction, Request, Response, Router} from "express";
import {body} from "express-validator";
import {checkToken, middleware} from "../middlewares/middleware";
import {CommentsRepository} from "../repositories/comments-repository";
import {container} from "../composition-root";
import {CommentsController} from "../controller-classes/comments-controller";

const commentController = container.resolve(CommentsController);

export const commentsRouter = Router();

const contentLength = body("content").isLength({min: 20, max: 300}).withMessage("Неверная длинна поля");
const checkUser = async (req: Request, res: Response, next: NextFunction) => {
    const comment: any = await new CommentsRepository().getCommentById(req.params.commentId);
    if (comment === null) {
        res.sendStatus(404);
        return;
    }
    if (comment.userId === req.user?.id) {
        next();
    } else {
        res.sendStatus(403);
    }
};
const checkLikeStatus = body("likeStatus").custom(status => {
    if (status === "None" || status === "Like" || status === "Dislike") {
        return true;
    } else {
        throw new Error("Не верный стус");
    }
});

commentsRouter.get("/:id", commentController.getComment.bind(commentController));
commentsRouter.delete("/:commentId", checkToken, checkUser, commentController.deleteComment.bind(commentController));
commentsRouter.put("/:commentId", checkToken, checkUser, contentLength, middleware, commentController.updateComment.bind(commentController));
commentsRouter.put("/:commentId/like-status", checkToken, checkLikeStatus, middleware, commentController.updateLikeStatusForComment.bind(commentController));