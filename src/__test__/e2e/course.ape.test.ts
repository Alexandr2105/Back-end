// import request from 'supertest'
// import {app} from "../../index";

// describe("video tests", () => {
// beforeAll(async () => {
//     await request(app).delete("/testing/all-data");
// });
//     it("Проверка на удлаление", async () => {
//         await request(app).get("/videos").expect(200, []);
//     });
//     it('Проверка на пустой массив', async () => {
//         await request(app).delete("/videos/123").expect(404);
//     });
//     let newVideo1: any = null;
//     let newVideo2: any = null;
//     it("Создает видео1", async () => {
//         const createVideo = await request(app)
//             .post("/videos")
//             .send({title: "asdfsdf", author: "asdf", availableResolutions: ["P144"]})
//             .expect(201)
//         newVideo1 = createVideo.body;
//         expect(newVideo1).toEqual({
//             id: newVideo1.id,
//             title: "asdfsdf",
//             author: "asdf",
//             canBeDownloaded: false,
//             minAgeRestriction: null,
//             createdAt: newVideo1.createdAt,
//             publicationDate: newVideo1.publicationDate,
//             availableResolutions: [
//                 "P144"
//             ]
//         })
//     });
//     it("Создает видео2", async () => {
//         const createVideo = await request(app)
//             .post("/videos")
//             .send({title: "aqwer", author: "qwert", availableResolutions: ["P720"]})
//             .expect(201)
//         newVideo2 = createVideo.body;
//         expect(newVideo2).toEqual({
//             id: newVideo2.id,
//             title: "aqwer",
//             author: "qwert",
//             canBeDownloaded: false,
//             minAgeRestriction: null,
//             createdAt: newVideo2.createdAt,
//             publicationDate: newVideo2.publicationDate,
//             availableResolutions: [
//                 "P720"
//             ]
//         })
//     });
//     it("Получаем все видео", async () => {
//         await request(app).get("/videos").expect(200, [newVideo1, newVideo2]);
//     });
//     it("Создает не верное видео", async () => {
//         const createVideo = await request(app)
//             .post("/videos")
//             .send({title: "", author: "asdf", availableResolutions: ["P144"]})
//             .expect(400)
//         expect(createVideo.body).toEqual({
//             errorsMessages: [
//                 {
//                     message: expect.any(String),
//                     field: "title"
//                 }
//             ]
//         })
//     });
//     it("Получаем видео по верному id", async () => {
//         await request(app).get("/videos/" + newVideo1.id).expect(200, newVideo1);
//     });
//     it("Получаем видео по не верному id", async () => {
//         await request(app).get("/videos/" + 1).expect(404);
//     });
//     it("Обновляем видео по id", async () => {
//         await request(app).put("/videos/" + newVideo1.id)
//             .send({
//                 title: "string",
//                 author: "string",
//                 availableResolutions: [
//                     "P144"
//                 ],
//                 canBeDownloaded: true,
//                 minAgeRestriction: 18,
//                 publicationDate: "2022-10-19T10:42:37.516Z"
//             })
//             .expect(204)
//         await request(app).get("/videos/" + newVideo1.id).expect(200, {
//             ...newVideo1,
//             title: "string",
//             author: "string",
//             availableResolutions: [
//                 "P144"
//             ],
//             canBeDownloaded: true,
//             minAgeRestriction: 18,
//             publicationDate: "2022-10-19T10:42:37.516Z"
//         })
//     });
//     it("Обновляем видео по не верному id", async () => {
//         await request(app).put("/videos/" + 1).expect(400);
//     });
//     it("Обновляем видео не верными данными", async () => {
//         const createVideo = await request(app)
//             .put("/videos/" + newVideo1.id)
//             .send({
//                 title: "", author: "asdf", availableResolutions: ["P144"],
//                 minAgeRestriction: 12, canBeDownloaded: false
//             })
//             .expect(400);
//         expect(createVideo.body).toEqual({
//             errorsMessages: [
//                 {
//                     message: expect.any(String),
//                     field: "title"
//                 }
//             ]
//         })
//     });
//     it("Проверка на удаление", async () => {
//         await request(app).delete("/videos/" + newVideo1.id).expect(204);
//         await request(app).delete("/videos/" + newVideo1.id).expect(404);
//         await request(app).get("/videos/" + newVideo1.id).expect(404);
//     });
// });
// describe("blogs tests", () => {
//     beforeAll(async () => {
//         await request(app).delete("/testing/all-data");
//     });
//     const pass = {Authorization: "Basic YWRtaW46cXdlcnR5"};
//     it("Проверка на удаление", async () => {
//         await request(app).get("/blogs").expect(200, {
//             pagesCount: 0,
//             page: 1,
//             pageSize: 10,
//             totalCount: 0,
//             items: [],
//         });
//         await request(app).put("/blogs/")
//             .expect(404);
//     });
//     it("Создаем новый post", async () => {
//         const post1 = await request(app).post("/blogs").set(pass).send({
//             name: "Alex",
//             youtubeUrl: "www.youtube.com"
//         }).expect(201);
//         let newPost = post1.body;
//         expect(newPost).toEqual({
//                 id: newPost.id,
//                 name: newPost.name,
//                 youtubeUrl: newPost.youtubeUrl,
//                 createdAt: newPost.createdAt,
//         });
// //TODO: доделать проверку на получение блога по id
//     });
// });
// describe("posts tests", () => {
//
// });