import request from 'supertest'
import {app} from "../../index";

const pass = {Authorization: "Basic YWRtaW46cXdlcnR5"};

describe("video tests", () => {
    beforeAll(async () => {
        await request(app).delete("/testing/all-data").expect(204);
    });
    it("Проверка на удлаление", async () => {
        await request(app).get("/videos").expect(200, []);
    });
    it('Проверка на пустой массив', async () => {
        await request(app).delete("/videos/123").expect(404);
    });
    let newVideo1: any;
    let newVideo2: any;
    it("Создает видео1", async () => {
        const createVideo = await request(app)
            .post("/videos")
            .send({title: "asdfsdf", author: "asdf", availableResolutions: ["P144"]})
            .expect(201)
        newVideo1 = createVideo.body;
        expect(newVideo1).toEqual({
            id: newVideo1.id,
            title: "asdfsdf",
            author: "asdf",
            canBeDownloaded: false,
            minAgeRestriction: null,
            createdAt: newVideo1.createdAt,
            publicationDate: newVideo1.publicationDate,
            availableResolutions: [
                "P144"
            ]
        })
    });
    it("Создает видео2", async () => {
        const createVideo = await request(app)
            .post("/videos")
            .send({title: "aqwer", author: "qwert", availableResolutions: ["P720"]})
            .expect(201)
        newVideo2 = createVideo.body;
        expect(newVideo2).toEqual({
            id: newVideo2.id,
            title: "aqwer",
            author: "qwert",
            canBeDownloaded: false,
            minAgeRestriction: null,
            createdAt: newVideo2.createdAt,
            publicationDate: newVideo2.publicationDate,
            availableResolutions: [
                "P720"
            ]
        })
    });
    it("Получаем все видео", async () => {
        await request(app).get("/videos").expect(200, [newVideo1, newVideo2]);
    });
    it("Создает не верное видео", async () => {
        const createVideo = await request(app)
            .post("/videos")
            .send({title: "", author: "asdf", availableResolutions: ["P144"]})
            .expect(400)
        expect(createVideo.body).toEqual({
            errorsMessages: [
                {
                    message: expect.any(String),
                    field: "title"
                }
            ]
        })
    });
    it("Получаем видео по верному id", async () => {
        await request(app).get("/videos/" + newVideo1.id).expect(200, newVideo1);
    });
    it("Получаем видео по не верному id", async () => {
        await request(app).get("/videos/" + 1).expect(404);
    });
    it("Обновляем видео по id", async () => {
        await request(app).put("/videos/" + newVideo1.id)
            .send({
                title: "string",
                author: "string",
                availableResolutions: [
                    "P144"
                ],
                canBeDownloaded: true,
                minAgeRestriction: 18,
                publicationDate: "2022-10-19T10:42:37.516Z"
            })
            .expect(204)
        await request(app).get("/videos/" + newVideo1.id).expect(200, {
            ...newVideo1,
            title: "string",
            author: "string",
            availableResolutions: [
                "P144"
            ],
            canBeDownloaded: true,
            minAgeRestriction: 18,
            publicationDate: "2022-10-19T10:42:37.516Z"
        })
    });
    it("Обновляем видео по не верному id", async () => {
        await request(app).put("/videos/" + 1).expect(400);
    });
    it("Обновляем видео не верными данными", async () => {
        const createVideo = await request(app)
            .put("/videos/" + newVideo1.id)
            .send({
                title: "", author: "asdf", availableResolutions: ["P144"],
                minAgeRestriction: 12, canBeDownloaded: false
            })
            .expect(400);
        expect(createVideo.body).toEqual({
            errorsMessages: [
                {
                    message: expect.any(String),
                    field: "title"
                }
            ]
        })
    });
    it("Проверка на удаление", async () => {
        await request(app).delete("/videos/" + newVideo1.id).expect(204);
        await request(app).delete("/videos/" + newVideo1.id).expect(404);
        await request(app).get("/videos/" + newVideo1.id).expect(404);
    });
});
describe("blogs tests", () => {
    const test = request(app);
    let newBlog1: any = null;
    let newBlog2: any = null;
    let newPost1: any = null;
    let newPost2: any = null;
    beforeAll(async () => {
        await test.delete("/testing/all-data").expect(204);
    });
    // it("Чистим коллекцию", async () => {
    //     await request(app).delete("/testing/all-data").expect(204);
    // });
    it("Проверка на удаление", async () => {
        await test.get("/blogs").expect(200, {
            pagesCount: 0,
            page: 1,
            pageSize: 10,
            totalCount: 0,
            items: [],
        });
    });
    it("Создаем новый blog1", async () => {
        const blog = await test.post("/blogs").set(pass).send({
            name: "Alex",
            websiteUrl: "www.youtube.com"
        }).expect(201);
        newBlog1 = blog.body;
        expect(newBlog1).toEqual({
            id: newBlog1.id,
            name: newBlog1.name,
            websiteUrl: newBlog1.youtubeUrl,
            createdAt: newBlog1.createdAt,
        });
    });
    it("Создаем новый blog2", async () => {
        const blog = await test.post("/blogs").set(pass).send({
            name: "Alex1",
            websiteUrl: "www.youtube1.com"
        }).expect(201);
        newBlog2 = blog.body;
        expect(newBlog2).toEqual({
            id: newBlog2.id,
            name: newBlog2.name,
            websiteUrl: newBlog2.youtubeUrl,
            createdAt: newBlog2.createdAt,
        });
    });
    it("Создаем новый blog без авторизации", async () => {
        await test.post("/blogs").send({
            name: "Alex1",
            websiteUrl: "www.youtube1.com"
        }).expect(401);
    });
    it("Создаем новый blog с не верными данными", async () => {
        await test.post("/blogs").set(pass).send({
            name: "",
            websiteUrl: "www.youtube1"
        }).expect(400, {
            errorsMessages: [
                {
                    message: "Это поле должно быть заплнено",
                    field: "name"
                }, {
                    message: "Не верно заполнено поле",
                    field: "youtubeUrl"
                }
            ]
        });
    });
    it("Получаем blog по id", async () => {
        await test.get("/blogs/" + newBlog1.id).expect(200, newBlog1);
    });
    it("Получаем blog по не верному id", async () => {
        await test.get("/blog/" + newBlog1).expect(404);
    });
    it("Получаем все blogs", async () => {
        await test.get("/blogs")
            .expect(200, {
                pagesCount: 1,
                page: 1,
                pageSize: 10,
                totalCount: 2,
                items: [newBlog2, newBlog1]
            });
    });
    it("Удаляем blog", async () => {
        await test.delete("/blogs/" + newBlog1.id).expect(401);
        await test.delete("/blogs/" + newBlog1.id).set(pass).expect(204);
        await test.get("/blogs/").expect(200, {
            pagesCount: 1,
            page: 1,
            pageSize: 10,
            totalCount: 1,
            items: [newBlog2],
        });
        await test.get("/blogs/" + newBlog1.id).expect(404);
        await test.delete("/blogs/" + newBlog1.id).set(pass).expect(404);
    });
    it("Редактируем blog2", async () => {
        await test.put("/blogs/123").expect(401);
        // await test.put("/blogs/123").set(pass).expect(404);
        const a = await test.put("/blogs/" + newBlog2).set(pass).send({
            name: "Stringasdfasdfasdfasdfsdf",
            websiteUrl: "asdfde"
        }).expect(400);
        expect(a.body).toEqual({
            errorsMessages: [
                {
                    message: expect.any(String),
                    field: "name"
                }, {
                    message: expect.any(String),
                    field: "youtubeUrl"
                }
            ]
        });
        await test.put("/blogs/" + newBlog2.id).set(pass).send({
            name: "Jora",
            websiteUrl: "www.youtube.com"
        }).expect(204);
    });
    it("Получаем blog по id", async () => {
        await test.get("/blogs/" + newBlog2.id).expect(200, {...newBlog2, name: "Jora", websiteUrl: "www.youtube.com"});
    });
    it("Создаем 2 posts по blogId с авторизацией", async () => {
        const post1 = await test.post("/blogs/" + newBlog2.id + "/posts").set(pass).send({
            title: "string1",
            shortDescription: "string1",
            content: "string1"
        }).expect(201);
        newPost1 = post1.body;
        expect(post1.body).toEqual({
            id: newPost1.id,
            title: newPost1.title,
            shortDescription: newPost1.shortDescription,
            content: newPost1.content,
            blogId: newPost1.blogId,
            blogName: newPost1.blogName,
            createdAt: newPost1.createdAt
        });
        const post2 = await test.post("/blogs/" + newBlog2.id + "/posts").set(pass).send({
            title: "string1",
            shortDescription: "string1",
            content: "string1"
        }).expect(201);
        newPost2 = post2.body;
        expect(post2.body).toEqual({
            id: newPost2.id,
            title: newPost2.title,
            shortDescription: newPost2.shortDescription,
            content: newPost2.content,
            blogId: newPost2.blogId,
            blogName: newPost2.blogName,
            createdAt: newPost2.createdAt
        });
    });
    it("Создаем post по blogId без авторизации", async () => {
        await test.post("/blogs/" + newBlog2 + "/posts").send({
            title: "string1",
            shortDescription: "string1",
            content: "string1"
        }).expect(401);
    });
    it("Создаем post по blogId с авторизацией с не верными данными", async () => {
        const post = await test.post("/blogs/" + newBlog2.id + "/posts").set(pass).send({
            title: "",
            shortDescription: "",
            content: ""
        }).expect(400);
        expect(post.body).toEqual({
            errorsMessages: [
                {
                    message: expect.any(String),
                    field: "title"
                }, {
                    message: expect.any(String),
                    field: "shortDescription",
                }, {
                    message: expect.any(String),
                    field: "content"
                }]
        });
    });
    it("Создаем post по не верному blogId с авторизацией", async () => {
        await test.post("/blogs/-1234/posts").set(pass).send({
            title: "",
            shortDescription: "",
            content: ""
        }).expect(404);
    });
    it("Получаем post по blog id", async () => {
        await test.get("/blogs/" + newBlog2.id + "/posts").expect(200, {
            pagesCount: 1,
            page: 1,
            pageSize: 10,
            totalCount: 2,
            items: [newPost2, newPost1]
        });
    });
    it("Получаем post по не верному blog id", async () => {
        await test.get("/blogs/" + newBlog1.id + "/posts").expect(404);
    });
});
describe("posts tests", () => {
    const test = request(app);
    let newPost1: any = null;
    let newPost2: any = null;
    let blog: any = null;
    let newUser: any = null;
    let login: any = null;
    beforeAll(async () => {
        await test.delete("/testing/all-data").expect(204);
    });
    it("Проверка на удаление", async () => {
        await test.get("/posts").expect(200, {
            pagesCount: 0,
            page: 1,
            pageSize: 10,
            totalCount: 0,
            items: [],
        });
    });
    it("Создаем два posts и один blog", async () => {
        blog = await test.post("/blogs").set(pass).send({
            name: "Alex",
            websiteUrl: "www.youtube.com"
        }).expect(201);
        const posts1 = await test.post("/posts").set(pass).send({
            title: "string1",
            shortDescription: "string1",
            content: "string1",
            blogId: blog.body.id
        }).expect(201);
        const posts2 = await test.post("/posts").set(pass).send({
            title: "string2",
            shortDescription: "string2",
            content: "string2",
            blogId: blog.body.id
        }).expect(201);
        newPost1 = posts1.body;
        newPost2 = posts2.body;
        expect(newPost1).toEqual({
            id: newPost1.id,
            title: newPost1.title,
            shortDescription: newPost1.shortDescription,
            content: newPost1.content,
            blogId: newPost1.blogId,
            blogName: newPost1.blogName,
            createdAt: newPost1.createdAt
        });
        expect(newPost2).toEqual({
            id: newPost2.id,
            title: newPost2.title,
            shortDescription: newPost2.shortDescription,
            content: newPost2.content,
            blogId: newPost2.blogId,
            blogName: newPost2.blogName,
            createdAt: newPost2.createdAt
        });
    });
    it("Создаем не верный post без авторизации", async () => {
        await test.post("/posts").send({
            title: "",
            shortDescription: "",
            content: "",
            blogId: "-12"
        }).expect(401);
    });
    it("Создаем не верный post с авторизацией", async () => {
        const post = await test.post("/posts").set(pass).send({
            title: "",
            shortDescription: "",
            content: "",
            blogId: "-12"
        }).expect(400);
        expect(post.body).toEqual({
            "errorsMessages": [
                {
                    "message": expect.any(String),
                    "field": "title"
                }, {
                    "message": expect.any(String),
                    "field": "shortDescription"
                }, {
                    "message": expect.any(String),
                    "field": "content"
                }, {
                    "message": expect.any(String),
                    "field": "blogId"
                }]
        });
    });
    it("Возвращаем все posts", async () => {
        test.get("posts").expect(200, {
            "pagesCount": 1,
            "page": 1,
            "pageSize": 10,
            "totalCount": 2,
            "items": [newPost2, newPost2]
        });
    });
    it("Получаем post по id", async () => {
        await test.get("/posts/" + newPost1.id).expect(200, newPost1);
    });
    it("Получаем post по не верному id", async () => {
        await test.get("/posts/234").expect(404);
    });
    it("Обновляем post по id", async () => {
        await test.put("/posts/" + newPost1.id).set(pass).send({
            title: "string",
            shortDescription: "string",
            content: "string",
            blogId: blog.body.id
        }).expect(204);
        await test.get("/posts/" + newPost1.id).expect(200, {
                ...newPost1,
                title: "string",
                shortDescription: "string",
                content: "string",
                blogId: blog.body.id
            }
        )
    });
    it("Обновляем post по id без авторизации", async () => {
        await test.put("/posts/" + newPost1).send({
            title: "string",
            shortDescription: "string",
            content: "string",
            blogId: "string"
        }).expect(401);
    });
    it("Обновляем post котрого нет", async () => {
        await test.put("/posts/1234").set(pass).send({
            title: "string",
            shortDescription: "string",
            content: "string",
            blogId: blog.id
        }).expect(404);
    });
    it("Обновляем post по id не верными данными", async () => {
        const post = await test.put("/posts/" + newPost1.id).set(pass).send({
            title: "",
            shortDescription: "",
            content: "",
            blogId: "-12"
        }).expect(400);
        expect(post.body).toEqual({
            "errorsMessages": [
                {
                    "message": expect.any(String),
                    "field": "title"
                }, {
                    "message": expect.any(String),
                    "field": "shortDescription"
                }, {
                    "message": expect.any(String),
                    "field": "content"
                }, {
                    "message": expect.any(String),
                    "field": "blogId"
                }]
        });
    });
    it("Удаляем post без авторизации", async () => {
        await test.delete("/posts/" + newPost1).expect(401);
    });
    it("Удаляем post с авторизацией", async () => {
        await test.delete("/posts/" + newPost1.id).set(pass).expect(204);
    });
    it("Удаляем не существующий post", async () => {
        await test.delete("/posts/" + newPost1.id).set(pass).expect(404);
        await test.get("/posts/" + newPost1.id).expect(404);
    });
    it("Создаем user", async () => {
        const user = await test.post("/users").set(pass).send({
            login: "string1",
            password: "string1",
            email: "123@gd.re"
        }).expect(201);
        newUser = user;
        expect(user.body).toEqual({
            id: user.body.id,
            login: user.body.login,
            email: user.body.email,
            createdAt: user.body.createdAt
        });
    });
    it("Входим в систему с помощью верного логина и пароля", async () => {
        login = await test.post("/auth/login").send({
            login: "string1",
            password: "string1"
        }).expect(200);
        console.log(login.body);
        console.log(login.body.accessToken);
        expect(login.body).toEqual({accessToken: login.body.accessToken});
    });
    it("Создаем коментарий с токеном по postId", async () => {
        const comment = await test.post("/posts/" + newPost2.id + "/comments").set({Authorization: login.body.accessToken}).send({
            "content": "stringstringstringst"
        }).expect(201);
        expect(comment).toEqual({
            "id": comment.body.id,
            "content": comment.body.content,
            "userId": comment.body.userId,
            "userLogin": comment.body.userLogin,
            "createdAt": comment.body.createdAt
        });
    });
    it("Создаем коментарий без токена по postId", async () => {
        await test.post("/posts/" + newPost2.id + "/comments").send({
            "content": "stringstringstringst"
        }).expect(401);
    });
    it("Создаем коментарий с токеном, но неверным контентом", async () => {
        await test.post("/posts/" + newPost2.id + "/comments").set({Authorization: login.body.accessToken}).send({
            "content": "string"
        }).expect(400);
    });
    it("Создаем коментарий по неверному postId", async () => {
        const comment = await test.post("/posts/1213/comments").set({Authorization: login.body.accessToken}).send({
            "content": "stringstringstringst"
        }).expect(201);
    });
});
describe("users tests", () => {
    beforeAll(async () => {
        await test.delete("/testing/all-data").expect(204);
    });
    const test = request(app);
    let newUser1: any = null;
    let newUser2: any = null;
    it("Проверка на удаление", async () => {
        await test.get("/posts").expect(200, {
            pagesCount: 0,
            page: 1,
            pageSize: 10,
            totalCount: 0,
            items: [],
        });
    });
    it("Создаем 2 users", async () => {
        const user1 = await test.post("/users").set(pass).send({
            "login": "string1",
            "password": "string1",
            "email": "123@gd.re"
        }).expect(201);
        const user2 = await test.post("/users").set(pass).send({
            "login": "string2",
            "password": "string2",
            "email": "123@gd.ru"
        }).expect(201);
        newUser1 = user1.body;
        newUser2 = user2.body;
        expect(newUser1).toEqual({
            id: newUser1.id,
            login: newUser1.login,
            email: newUser1.email,
            createdAt: newUser1.createdAt
        });
        expect(newUser2).toEqual({
            id: newUser2.id,
            login: newUser2.login,
            email: newUser2.email,
            createdAt: newUser2.createdAt
        });
    });
    it("Создаем user без авторизации", async () => {
        await test.post("/posts").send({
            "login": "string1",
            "password": "string1",
            "email": "123@gd.re"
        }).expect(401);
    });
    it("Создаем user с авторизацией и неверными данными", async () => {
        const post = await test.post("/users").set(pass).send({
            "login": "st",
            "password": "str",
            "email": "123@gd"
        }).expect(400);
        expect(post.body).toEqual({
            "errorsMessages": [
                {
                    "message": expect.any(String),
                    "field": "login"
                }, {
                    "message": expect.any(String),
                    "field": "password"
                }, {
                    "message": expect.any(String),
                    "field": "email"
                }
            ]
        });
    });
    it("Получаем всех users", async () => {
        await test.get("/users").expect(200, {
            "pagesCount": 1,
            "page": 1,
            "pageSize": 10,
            "totalCount": 2,
            "items": [newUser2, newUser1]
        });
    });
    it("Удаляем user по id с авторизацией", async () => {
        await test.delete("/users/" + newUser1.id).set(pass).expect(204);
    });
    it("Удаляем user по id без авторизации", async () => {
        await test.delete("/users/" + newUser1.id).expect(401);
    });
    it("Удаляем user по неверному id с авторизацией", async () => {
        await test.delete("/users/" + newUser1.id).set(pass).expect(404);
    });
    it("Проверка на удаление user", async () => {
        await test.get("/users/" + newUser1.id).expect(404);
    });
    //TODO:как сделаю токен доделать все для коментария!!!
});
describe("comments tests", () => {
    beforeAll(async () => {
        await test.delete("/testing/all-data").expect(204);
    });
    const test = request(app);
    let newComment1: any = null;
    let newComment2: any = null;
    it("Создаем user", async () => {
        await test.post("/users").set(pass).send({
            "login": "string1",
            "password": "string1",
            "email": "123@gd.re"
        }).expect(201);
    });
    it("Входим в систему с помощью верного логина и пароля", async () => {
        const post = await test.post("/auth/login").send({
            login: "string2",
            password: "string2"
        }).expect(200);
        expect(post.body).toEqual({accessToken: expect.any(String)});
    });
    it("Удаляем не существующий blog", async () => {

    });
    it("Удаляем не существующий blog", async () => {

    });
    it("Удаляем не существующий blog", async () => {

    });
});
describe("Auth tests", () => {
    beforeAll(async () => {
        await test.delete("/testing/all-data").expect(204);
    });
    it("Проверка на удаление", async () => {
        await test.get("/blogs").expect(200, {
            pagesCount: 0,
            page: 1,
            pageSize: 10,
            totalCount: 0,
            items: [],
        });
    });
    const test = request(app);
    let newUser1: any = null;
    it("Создаем user", async () => {
        const user1 = await test.post("/users").set(pass).send({
            login: "string1",
            password: "string1",
            email: "123@gd.re"
        }).expect(201);
        newUser1 = user1.body;
        expect(newUser1).toEqual({
            id: newUser1.id,
            login: newUser1.login,
            email: newUser1.email,
            createdAt: newUser1.createdAt
        });
    });
    it("Входим в систему с помощью верного логина и пароля", async () => {
        const post = await test.post("/auth/login").send({
            login: "string1",
            password: "string1"
        }).expect(200);
        expect(post.body).toEqual({accessToken: expect.any(String)});
    });
    it("Входим в систему с помощью неверного логина и пароля", async () => {
        await test.post("/auth/login").send({
            login: "asdf",
            password: "adfsf"
        }).expect(401);
    });
    it("Входим в систему с неверными данными", async () => {
        const post = await test.post("/auth/login").send({
            login: "",
            password: ""
        }).expect(400)
        expect(post.body).toEqual({
            errorsMessages: [{
                message: expect.any(String),
                field: "login"
            }, {
                message: expect.any(String),
                field: "password"
            }]
        });
    });
});