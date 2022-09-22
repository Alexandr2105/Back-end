import express, {Request, Response} from 'express';
import {videosRouter} from "./routes/videos-router";
import {testingRouter} from "./routes/testing-router";
import {blogsRouters} from "./routes/blogs-routers";
import {postsRouters} from "./routes/posts-routers";


const app = express();
const port = process.env.PORT || 3000;

const parserMiddleware = express.json();
app.use(parserMiddleware);

app.use("/videos", videosRouter);
app.use("/testing", testingRouter);
app.use("/blogs", blogsRouters);
app.use("/posts", postsRouters);

app.get("/", (req: Request, res: Response) => {
    let helloMessage = 'Hello World!!!';
    res.send(helloMessage);
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});