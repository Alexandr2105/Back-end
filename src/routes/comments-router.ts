import {Router, Request, Response, NextFunction} from "express";
import {commentService} from "../domain/comment-service";
import {body} from "express-validator";
import {checkToken, middleWare} from "../middlewares/middleware";
import {commentsRepository} from "../repositories/comments-repository";
import {jwtService} from "../application/jwt-service";

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
};
const checkLikeStatus = body("likeStatus").custom(status => {
    if (status === "None" || status === "Like" || status === "Dislike") {
        return true;
    } else {
        throw new Error("Не верный стус");
    }
});

commentsRouter.get("/:id", async (req: Request, res: Response) => {
    // const user: any = jwtService.getUserByRefreshToken(req.cookies.refreshToken);
    const userId: any = jwtService.getUserIdByToken(req.headers.authorization!.split(" ")[1]);
    const comment = await commentService.getLikesInfo(req.params.id, userId.toString());
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

commentsRouter.put("/:commentId/like-status", checkToken, checkLikeStatus, middleWare, async (req: Request, res: Response) => {
    const comment = await commentsRepository.getCommentById(req.params.commentId);
    if (!comment) {
        res.sendStatus(404);
        return;
    }
    const userId: any = await jwtService.getUserIdByToken(req.headers.authorization!.split(" ")[1]);
    const lakeStatus = await commentService.createLikeStatus(req.params.commentId, userId.toString(), req.body.likeStatus);
    if (lakeStatus) res.sendStatus(204);
});