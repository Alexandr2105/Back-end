import {Router, Request, Response, NextFunction} from "express";
import {CommentsService} from "../domain/comments-service";
import {body} from "express-validator";
import {checkToken, middleWare} from "../middlewares/middleware";
import {JwtService} from "../application/jwt-service";
import {CommentsRepository} from "../repositories/comments-repository";
import {UsersRepository} from "../repositories/users-repository";

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

class CommentsController {
    private commentsService: CommentsService;
    private commentsRepository: CommentsRepository;
    private usersRepository: UsersRepository;
    private jwtService:JwtService;

    constructor() {
        this.commentsService = new CommentsService();
        this.commentsRepository = new CommentsRepository();
        this.usersRepository = new UsersRepository();
        this.jwtService=new JwtService();
    };

    async getComment(req: Request, res: Response) {
        let comment;
        if (req.headers.authorization) {
            const userId: any = this.jwtService.getUserIdByToken(req.headers.authorization!.split(" ")[1]);
            comment = await this.commentsService.getLikesInfo(req.params.id, userId.toString());
        } else {
            comment = await this.commentsService.getLikesInfo(req.params.id, "null");
        }
        if (comment) {
            res.send(comment);
        } else {
            res.sendStatus(404);
        }
    };

    async deleteComment(req: Request, res: Response) {
        const delComment = await this.commentsService.deleteCommentById(req.params.commentId);
        if (!delComment) {
            res.sendStatus(404);
        } else {
            res.sendStatus(204);
        }
    };

    async updateComment(req: Request, res: Response) {
        const putComment = await this.commentsService.updateCommentById(req.params.commentId, req.body.content);
        if (!putComment) {
            res.sendStatus(404);
        } else {
            res.sendStatus(204);
        }
    };

    async updateLikeStatusForComment(req: Request, res: Response) {
        const comment = await this.commentsRepository.getCommentById(req.params.commentId);
        if (!comment) {
            res.sendStatus(404);
            return;
        }
        const userId: any = await this.jwtService.getUserIdByToken(req.headers.authorization!.split(" ")[1]);
        const user: any = await this.usersRepository.getUserId(userId!.toString());
        const lakeStatus = await this.commentsService.createLikeStatus(req.params.commentId, userId.toString(), req.body.likeStatus, user.login);
        if (lakeStatus) res.sendStatus(204);
    };
}

const commentController = new CommentsController();

commentsRouter.get("/:id", commentController.getComment.bind(commentController));
commentsRouter.delete("/:commentId", checkToken, checkUser, commentController.deleteComment.bind(commentController));
commentsRouter.put("/:commentId", checkToken, checkUser, contentLength, middleWare, commentController.updateComment.bind(commentController));
commentsRouter.put("/:commentId/like-status", checkToken, checkLikeStatus, middleWare, commentController.updateLikeStatusForComment.bind(commentController));