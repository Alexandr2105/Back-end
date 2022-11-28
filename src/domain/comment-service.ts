import {commentsRepository} from "../repositories/comments-repository";
import {ItemsComments} from "../helper/allTypes";

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
    async getLikesInfo(idComment: string, userId: string): Promise<boolean | ItemsComments> {
        const comment = await this.getCommentById(idComment);
        const likeStatus: any = await commentsRepository.getLikesInfo(idComment);
        const dislikeStatus: any = await commentsRepository.getDislikeInfo(idComment);
        const myStatus: any = await commentsRepository.getMyStatus(userId, idComment);
        if (comment) {
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
    },
    async createLikeStatus(commentId: string, userId: string, likeStatus: string, login: string) {
        const checkComment = await commentsRepository.getInfoStatusByComment(commentId, userId);
        if (checkComment) {
            return await commentsRepository.updateStatusComment(commentId, userId, likeStatus);
        } else {
            const statusComment = {
                id: commentId,
                userId: userId,
                login: login,
                status: likeStatus,
                createDate: new Date().toISOString()
            }
            return await commentsRepository.setLikeStatus(statusComment);
        }
    }
}