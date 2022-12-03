import {CommentsRepository} from "../repositories/comments-repository";
import {UsersRepository} from "../repositories/users-repository";
import {JwtService} from "../application/jwt-service";
import {CommentsService} from "../domain/comments-service";
import {Request, Response} from "express";

export class CommentsController {

    constructor(protected commentsService: CommentsService,
                protected commentsRepository: CommentsRepository,
                protected usersRepository: UsersRepository,
                protected jwtService: JwtService) {
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