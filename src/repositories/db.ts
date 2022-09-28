import {MongoClient} from "mongodb";

export type BlogsType = {
    id: string,
    name: string,
    youtubeUrl: string,
    createdAt: string;
};

const mongoUri = process.env.mongoUri ||"mongodb+srv://Alex:admin@cluster0.g70qjhf.mongodb.net/tube?retryWrites=true&w=majority";

const client=new MongoClient(mongoUri);
const db = client.db("tube");
export const blogsCollection = db.collection<BlogsType>("blogs");

export async function runDb(){
    try {
    await client.connect();
    await  client.db("blogs").command({ping:1});
    console.log("Подключились к монго серверу");
        }catch{
        console.log("Нет подключения к БД");
        await client.close();
    }
}