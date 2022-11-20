type BlogsType = {
    id: string,
    name: string,
    description: string,
    websiteUrl: string,
    createdAt: string;
};

export const blogs: BlogsType[] = [
    {
        "id": "1",
        "name": "Bob",
        "description": "qwerasdfere eadsf",
        "websiteUrl": "https://www.youtube.com",
        "createdAt": new Date().toISOString()
    },
    {
        "id": "2",
        "name": "Alex",
        "description": "qwerasdfere eadsf",
        "websiteUrl": "https://learn.javascript.ru",
        "createdAt": new Date().toISOString()
    },
    {
        "id": "3",
        "name": "Petr",
        "description": "qwerasdfere eadsf",
        "websiteUrl": "https://github.com",
        "createdAt": new Date().toISOString()
    }
]

export const blogsRepository = {
    async getAllBlogs(): Promise<BlogsType[]> {
        return blogs;
    },
    async getBlogsId(id: string): Promise<BlogsType | boolean> {
        for (let blog of blogs) {
            if (blog.id === id) {
                return blog;
            }
        }
        return false;
    },
    async deleteBlogsId(id: string): Promise<boolean> {
        for (let a = 0; a < blogs.length; a++) {
            if (blogs[a].id === id) {
                blogs.splice(a, 1);
                return true;
            }
        }
        return false;
    },
    async createBlog(name: string, url: string, description: string): Promise<BlogsType> {
        const dateNow = +new Date() + "";
        const newBlog = {
            id: dateNow,
            name: name,
            description: description,
            websiteUrl: url,
            createdAt: new Date().toISOString()
        };
        blogs.push(newBlog);
        return newBlog;
    },
    async updateBlog(id: string, name: string, url: string): Promise<boolean> {
        for (let blog of blogs) {
            if (blog.id == id) {
                blog.name = name;
                blog.websiteUrl = url;
                blog.createdAt;
                return true;
            }
        }
        return false;
    }
};