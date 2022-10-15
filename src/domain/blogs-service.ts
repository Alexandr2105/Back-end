import {blogsRepository} from "../repositories/blogs-db-repository";
import {BlogsType} from "../db/db";

export const blogsService = {
    async getBlogsId(id: string): Promise<BlogsType | boolean> {
        return blogsRepository.getBlogsId(id);
    },
    async deleteBlogsId(id: string): Promise<boolean> {
        return blogsRepository.deleteBlogsId(id);
    },
    async createBlog(name: string, url: string): Promise<BlogsType> {
        const dateNow = +new Date() + "";
        const newBlog = {
            id: dateNow,
            name: name,
            youtubeUrl: url,
            createdAt: new Date().toISOString()
        };
        return blogsRepository.createBlog(newBlog);
    },
    async updateBlog(id: string, name: string, url: string): Promise<boolean> {
        return blogsRepository.updateBlog(id, name, url);
    }
};