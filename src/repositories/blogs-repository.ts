type VideoType = {
    id: string,
    name: string,
    youtubeUrl: string,
};

export const blogs: VideoType[] = [
    {
        "id": "1",
        "name": "Bob",
        "youtubeUrl": "https://www.youtube.com"
    },
    {
        "id": "2",
        "name": "Alex",
        "youtubeUrl": "https://learn.javascript.ru"
    },
    {
        "id": "3",
        "name": "Petr",
        "youtubeUrl": "https://github.com"
    }
]

export const blogsRepository = {
    getAllBlogs() {
        return blogs;
    },
    getBlogsId(id: string) {
        for (let blog of blogs) {
            if (blog.id === id) {
                return blog;
            }
        }
        return false;
    },
    deleteBlogsId(id: string) {
        for (let a = 0; a < blogs.length; a++) {
            if (blogs[a].id === id) {
                blogs.splice(a, 1);
                return true;
            }
        }
        return false;
    },
    createBlog(name: string, url: string) {
        const dateNow = +new Date() + "";
        const newBlog = {
            id: dateNow,
            name: name,
            youtubeUrl: url
        };
        blogs.push(newBlog);
        return newBlog;
    },
    updateBlog(id: string, name: string, url: string) {
        for (let blog of blogs) {
            if (blog.id == id) {
                blog.name = name;
                blog.youtubeUrl = url;
                return 204;
            }
        }
        return 404;
    }
};