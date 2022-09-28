import {blogsCollection, BlogsType} from "./db";

const option = {projection: {_id: 0}};

export const blogsRepository = {
    async getAllBlogs(): Promise<BlogsType[]> {
        return blogsCollection.find({}, option).toArray();
    },
    async getBlogsId(id: string): Promise<BlogsType | boolean> {
        let blog = await blogsCollection.findOne({id: id},option);
        if (blog) {
            return blog;
        } else {
            return false;
        }
    },
    async deleteBlogsId(id: string): Promise<boolean> {
        let result = await blogsCollection.deleteOne({"id": id});
        return result.deletedCount === 1;
    },
    async createBlog(name: string, url: string): Promise<BlogsType> {
        const dateNow = +new Date() + "";
        const newBlog = {
            id: dateNow,
            name: name,
            youtubeUrl: url,
            createdAt: new Date().toISOString()
        };
        await blogsCollection.insertOne(newBlog);
        return newBlog;
    },
    async updateBlog(id: string, name: string, url: string): Promise<boolean> {
        const updateBlog = await blogsCollection.updateOne({
                id: id
            }, {
                $set:
                    {
                        name: name,
                        youtubeUrl: url,
                    }
            }
        );
        return updateBlog.matchedCount === 1;
    }
};