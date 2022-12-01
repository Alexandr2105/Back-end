import {Router, Request, Response, NextFunction} from "express";
import {commentsService} from "../domain/comments-service";
import {body} from "express-validator";
import {checkToken, middleWare} from "../middlewares/middleware";
import {commentsRepository} from "../repositories/comments-repository";
import {jwtService} from "../application/jwt-service";
import {usersRepository} from "../repositories/users-repository";

export const commentsRouter = Router();

const contentLength = body("content").isLength({min: 20, max: 300}).withMessage("Неверная длинна поля");
const checkUser = async (req: Request, res: Response, next: NextFunction) => {
    const comment: any = await commentsService.getCommentById(req.params.commentId);
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
    let comment;
    if (req.headers.authorization) {
        const userId: any = jwtService.getUserIdByToken(req.headers.authorization!.split(" ")[1]);
        comment = await commentsService.getLikesInfo(req.params.id, userId.toString());
    } else {
        comment = await commentsService.getLikesInfo(req.params.id, "null");
    }
    if (comment) {
        res.send(comment);
    } else {
        res.sendStatus(404);
    }
});

commentsRouter.delete("/:commentId", checkToken, checkUser, async (req: Request, res: Response) => {
    const delComment = await commentsService.deleteCommentById(req.params.commentId);
    if (!delComment) {
        res.sendStatus(404);
    } else {
        res.sendStatus(204);
    }
});

commentsRouter.put("/:commentId", checkToken, checkUser, contentLength, middleWare, async (req: Request, res: Response) => {
    const putComment = await commentsService.updateCommentById(req.params.commentId, req.body.content);
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
    const user: any = await usersRepository.getUserId(userId!.toString());
    const lakeStatus = await commentsService.createLikeStatus(req.params.commentId, userId.toString(), req.body.likeStatus, user.login);
    if (lakeStatus) res.sendStatus(204);
});