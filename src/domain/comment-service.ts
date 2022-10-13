import {commentsRepository} from "../repositories/comments-repository";

export const commentService = {
    getCommentById(id: string) {
        return commentsRepository.getCommentById(id);
    },
    deleteCommentById(id: string) {
        return commentsRepository.deleteCommentById(id);
    },
    updateCommentById(id: string, content: string) {
        return commentsRepository.updateCommentById(id, content);
    }
}