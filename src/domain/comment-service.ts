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
    },
    async getLikesInfo(idComment: string, userId: string) {
        const comment = await this.getCommentById(idComment);
        const likeStatus = await commentsRepository.getLikesInfo(idComment);
        const dislikeStatus = await commentsRepository.getDislikeInfo(idComment);
        const myStatus = await commentsRepository.getMyStatus(userId);
        if (comment && likeStatus) {
            return {
                id: comment.id,
                content: comment.content,
                userId: comment.userId,
                userLogin: comment.userLogin,
                createdAt: comment.createdAt,
                likesInfo: {
                    likesCount: likeStatus,
                    dislikesCount: dislikeStatus,
                    myStatus: myStatus,
                }
            }
        } else {
            return false;
        }
    }
}