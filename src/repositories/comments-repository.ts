import {commentsCollection, CommentType} from "../db/db";

const option = {projection: {_id: 0, idPost: 0}};

export const commentsRepository = {
    async getCommentById(id: string) {
        return await commentsCollection.findOne({id: id}, option);
    },
    async deleteCommentById(id: string): Promise<boolean> {
        const result = await commentsCollection.deleteOne({id: id});
        return result.deletedCount === 1;
    },
    async updateCommentById(id: string, content: string) {
        const result = await commentsCollection.updateOne({id: id}, {$set: {content: content}});
        return result.matchedCount === 1;
    },
    async createComment(comment: CommentType) {
        await commentsCollection.insertOne(comment);
        return comment;
    }
}