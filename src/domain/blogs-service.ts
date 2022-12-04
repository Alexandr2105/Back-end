import {BlogsDbRepository} from "../repositories/blogs-db-repository";
import {ItemsBlogs} from "../helper/allTypes";
import {inject, injectable} from "inversify";

@injectable()
export class BlogsService {

    constructor(@inject(BlogsDbRepository) protected blogsRepository: BlogsDbRepository) {
    };

    async getBlogsId(id: string): Promise<ItemsBlogs | boolean> {
        return this.blogsRepository.getBlogsId(id);
    };

    async deleteBlogsId(id: string): Promise<boolean> {
        return this.blogsRepository.deleteBlogsId(id);
    };

    async createBlog(name: string, url: string, description: string): Promise<ItemsBlogs> {
        const dateNow = +new Date() + "";
        const newBlog = new ItemsBlogs(dateNow, name, description, url, new Date().toISOString());
        return this.blogsRepository.createBlog(newBlog);
    };

    async updateBlog(id: string, name: string, url: string): Promise<boolean> {
        return this.blogsRepository.updateBlog(id, name, url);
    };
}