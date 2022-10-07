import express, {Request, Response} from 'express';
import {videosRouter} from "./routes/videos-router";
import {testingRouter} from "./routes/testing-router";
import {blogsRouter} from "./routes/blogs-router";
import {postsRouter} from "./routes/posts-router";
import {runDb} from "./db/db";
import {usersRouter} from "./routes/users-router";

const app = express();
const port = process.env.PORT || 3000;

const parserMiddleware = express.json();
app.use(parserMiddleware);

app.use("/videos", videosRouter);
app.use("/testing", testingRouter);
app.use("/blogs", blogsRouter);
app.use("/posts", postsRouter);
app.use("/users", usersRouter);

app.get("/", (req: Request, res: Response) => {
    let helloMessage = 'Hello World!!!';
    res.send(helloMessage);
});

const startApp = async () => {
    await runDb();
    app.listen(port, () => {
        console.log(`Example app listening on port ${port}`);
    })
};

startApp();