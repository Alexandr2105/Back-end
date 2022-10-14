import {Router, Request, Response} from "express";
import {commentService} from "../domain/comment-service";

export const commentsRouter = Router();

commentsRouter.get("/:id", async (req: Request, res: Response) => {
    const comment = await commentService.getCommentById(req.params.id);
    if (comment) {
        res.send(comment);
        debugger;
    } else {
        res.sendStatus(404);
    }
});

commentsRouter.delete("/:commentId", async (req: Request, res: Response) => {
    const delComment = await commentService.deleteCommentById(req.params.commentId);
    if (!delComment) {
        res.sendStatus(404);
    } else {
        res.sendStatus(204);
    }
});

commentsRouter.put("/:commentId", async (req: Request, res: Response) => {
    const putComment = await commentService.updateCommentById(req.params.commentId, req.body.content);
    if (!putComment) {
        res.sendStatus(404);
    } else {
        res.sendStatus(204);
    }
});