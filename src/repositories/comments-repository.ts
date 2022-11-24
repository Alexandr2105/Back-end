import {commentsCollection, likeInfoCollection} from "../db/db";
import {CommentsTypeForDB, ItemsComments, LikeInfoTypeForDB} from "../helper/allTypes";

export const commentsRepository = {
    async getCommentById(id: string): Promise<ItemsComments | null> {
        return commentsCollection.findOne({id: id});
    },
    async deleteCommentById(id: string): Promise<boolean> {
        const result = await commentsCollection.deleteOne({id: id});
        return result.deletedCount === 1;
    },
    async updateCommentById(id: string, content: string): Promise<boolean> {
        const result = await commentsCollection.updateOne({id: id}, {$set: {content: content}});
        return result.matchedCount === 1;
    },
    async createComment(comment: CommentsTypeForDB): Promise<CommentsTypeForDB> {
        await commentsCollection.create(comment);
        return comment;
    },
    async getLikesInfo(idComment: string): Promise<number | undefined> {
        const allLikes = await likeInfoCollection.find({commentId: idComment, status: {$regex: "Like"}});
        if (allLikes) {
            return allLikes.length;
        }
    },
    async getDislikeInfo(idComment: string): Promise<number | undefined> {
        const allDislikes = await likeInfoCollection.find({
            commentId: idComment,
            status: {$regex: "Dislike"}
        });
        if (allDislikes) {
            return allDislikes.length;
        }
    },
    async getMyStatus(userId: string, commentId: string): Promise<string | undefined> {
        const commentInfo = await likeInfoCollection.findOne({userId: userId, commentId: commentId});
        if (commentInfo) {
            return commentInfo.status.toString();
        } else {
            return "None";
        }
    },
    async setLikeStatus(likeInfo: LikeInfoTypeForDB): Promise<boolean> {
        const info = await likeInfoCollection.create(likeInfo);
        return !!info;
    },
    async getInfoStatusByComment(idComment: string, userId: string) {
        return likeInfoCollection.findOne({commentId: idComment, userId: userId});
    },
    async updateStatusComment(idComment: string, userId: string, status: string): Promise<boolean> {
        const newStatusComment = await likeInfoCollection.updateOne({
            commentId: idComment,
            userId: userId
        }, {$set: {status: status}});
        return newStatusComment.matchedCount === 1;
    }
}