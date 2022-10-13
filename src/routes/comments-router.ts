import {Router, Request, Response} from "express";
import {commentService} from "../domain/comment-service";

export const commentsRouter = Router();

commentsRouter.get("/:id", (req: Request, res: Response) => {
    const comment = commentService.getCommentById(req.params.id);
    if (comment) {
        res.send(comment);
    } else {
        res.sendStatus(404);
    }
});

commentsRouter.delete("/:commentId", (req: Request, res: Response) => {
    const delComment = commentService.deleteCommentById(req.params.commentId);
    if (!delComment) {
        res.sendStatus(404);
    } else {
        res.sendStatus(204);
    }
});

commentsRouter.put("/:commentId", (req: Request, res: Response) => {
    const putComment = commentService.updateCommentById(req.params.commentId, req.body.content);
    if (!putComment) {
        res.sendStatus(404);
    } else {
        res.sendStatus(204);
    }
});

//TODO: доделать put for comments