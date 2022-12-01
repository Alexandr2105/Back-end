import {blogsRepository} from "../repositories/blogs-db-repository";
import {ItemsBlogs} from "../helper/allTypes";

class BlogsService {
    async getBlogsId(id: string): Promise<ItemsBlogs | boolean> {
        return blogsRepository.getBlogsId(id);
    };

    async deleteBlogsId(id: string): Promise<boolean> {
        return blogsRepository.deleteBlogsId(id);
    };

    async createBlog(name: string, url: string, description: string): Promise<ItemsBlogs> {
        const dateNow = +new Date() + "";
        const newBlog = new ItemsBlogs(dateNow, name, description, url, new Date().toISOString());
        return blogsRepository.createBlog(newBlog);
    };

    async updateBlog(id: string, name: string, url: string): Promise<boolean> {
        return blogsRepository.updateBlog(id, name, url);
    };
}

export const blogsService = new BlogsService();