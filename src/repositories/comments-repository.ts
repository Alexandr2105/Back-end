import {commentsCollection, CommentType, likeInfoCollection} from "../db/db";

const option = {projection: {_id: 0, idPost: 0}};

export const commentsRepository = {
    async getCommentById(id: string): Promise<CommentType | null> {
        return await commentsCollection.findOne({id: id}, option);
    },
    async deleteCommentById(id: string): Promise<boolean> {
        const result = await commentsCollection.deleteOne({id: id});
        return result.deletedCount === 1;
    },
    async updateCommentById(id: string, content: string): Promise<boolean> {
        const result = await commentsCollection.updateOne({id: id}, {$set: {content: content}});
        return result.matchedCount === 1;
    },
    async createComment(comment: CommentType): Promise<CommentType> {
        await commentsCollection.insertOne(comment);
        return comment;
    },
    async getLikesInfo(idComment: string): Promise<number | undefined> {
        const allLikes = await likeInfoCollection.find({commentId: idComment, status: {$regex: "Like"}}).toArray();
        if (allLikes) {
            return allLikes.length;
        }
    },
    async getDislikeInfo(idComment: string): Promise<number | undefined> {
        const allDislikes = await likeInfoCollection.find({
            commentId: idComment,
            status: {$regex: "Dislike"}
        }).toArray();
        if (allDislikes) {
            return allDislikes.length;
        }
    },
    async getMyStatus(userId: string): Promise<string | undefined> {
        const commentInfo = await likeInfoCollection.findOne({userId: userId});
        if (commentInfo) return commentInfo.status.toString();
    }
}