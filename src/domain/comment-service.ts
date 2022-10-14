import {commentsRepository} from "../repositories/comments-repository";

export const commentService = {
    async getCommentById(id: string) {
        return await commentsRepository.getCommentById(id);
    },
    async deleteCommentById(id: string) {
        return await commentsRepository.deleteCommentById(id);
    },
    async updateCommentById(id: string, content: string) {
        return await commentsRepository.updateCommentById(id, content);
    }
}