import {Router, Request, Response, NextFunction} from "express";
import {commentService} from "../domain/comment-service";
import {body} from "express-validator";
import {checkToken, middleWare} from "../middlewares/middleware";

export const commentsRouter = Router();

const contentLength = body("content").isLength({min: 20, max: 300}).withMessage("Неверная длинна поля");
const checkUser = async (req: Request, res: Response, next: NextFunction) => {
    const comment: any = await commentService.getCommentById(req.params.commentId);
    if (comment === null) {
        res.sendStatus(404);
        return;
    }
    if (comment.userId === req.user?.id) {
        next();
    } else {
        res.sendStatus(403);
    }
}

commentsRouter.get("/:id", async (req: Request, res: Response) => {
    const comment = await commentService.getCommentById(req.params.id);
    if (comment) {
        res.send(comment);
    } else {
        res.sendStatus(404);
    }
});

commentsRouter.delete("/:commentId", checkToken, checkUser, async (req: Request, res: Response) => {
    const delComment = await commentService.deleteCommentById(req.params.commentId);
    if (!delComment) {
        res.sendStatus(404);
    } else {
        res.sendStatus(204);
    }
});

commentsRouter.put("/:commentId", checkToken, checkUser, contentLength, middleWare, async (req: Request, res: Response) => {
    const putComment = await commentService.updateCommentById(req.params.commentId, req.body.content);
    if (!putComment) {
        res.sendStatus(404);
    } else {
        res.sendStatus(204);
    }
});