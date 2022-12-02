class BlogsType {

    constructor(public id: string,
                public name: string,
                public description: string,
                public websiteUrl: string,
                public createdAt: string) {

    }
}

export class BlogsInMemoryRepository {
    blogs = [
        new BlogsType("1", "Bob", "qwerasdfere eadsf", "https://www.youtube.com", new Date().toISOString()),
        new BlogsType("2", "Alex", "qwerasdfere eadsf", "https://learn.javascript.ru", new Date().toISOString()),
        new BlogsType("3", "Petr", "qwerasdfere eadsf", "https://github.com", new Date().toISOString())
    ];

    async getBlogsId(id: string): Promise<BlogsType | boolean> {
        for (let blog of this.blogs) {
            if (blog.id === id) {
                return blog;
            }
        }
        return false;
    };

    async deleteBlogsId(id: string): Promise<boolean> {
        for (let a = 0; a < this.blogs.length; a++) {
            if (this.blogs[a].id === id) {
                this.blogs.splice(a, 1);
                return true;
            }
        }
        return false;
    };

    async createBlog(name: string, url: string, description: string): Promise<BlogsType> {
        const dateNow = +new Date() + "";
        const newBlog = new BlogsType(dateNow, name, description, url, new Date().toISOString());
        this.blogs.push(newBlog);
        return newBlog;
    };

    async updateBlog(id: string, name: string, url: string): Promise<boolean> {
        for (let blog of this.blogs) {
            if (blog.id == id) {
                blog.name = name;
                blog.websiteUrl = url;
                return true;
            }
        }
        return false;
    };
}