import {blogsCollection} from "../db/db";
import {ItemsBlogs} from "../helper/allTypes";

class BlogsDbRepository {
    async getBlogsId(id: string): Promise<ItemsBlogs | boolean> {
        const blog = await blogsCollection.findOne({id: id});
        if (blog) {
            return {
                id: blog.id,
                websiteUrl: blog.websiteUrl,
                description: blog.description,
                name: blog.name,
                createdAt: blog.createdAt,
            }
        } else {
            return false;
        }
    };

    async deleteBlogsId(id: string): Promise<boolean> {
        let result = await blogsCollection.deleteOne({id: id});
        return result.deletedCount === 1;
    };

    async createBlog(newBlog: ItemsBlogs): Promise<ItemsBlogs> {
        await blogsCollection.create(newBlog);
        return newBlog;
    };

    async updateBlog(id: string, name: string, url: string): Promise<boolean> {
        const updateBlog = await blogsCollection.updateOne({id: id}, {
            $set: {
                name: name,
                websiteUrl: url,
            }
        });
        return updateBlog.matchedCount === 1;
    };
}

export const blogsRepository = new BlogsDbRepository();