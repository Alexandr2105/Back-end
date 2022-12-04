import "reflect-metadata";
import {VideosRepository} from "./repositories/videos-repository";
import {VideosService} from "./domain/videos-service";
import {VideosController} from "./controller-classes/videos-controller";
import {UsersRepository} from "./repositories/users-repository";
import {UsersService} from "./domain/users-service";
import {UsersController} from "./controller-classes/users-controller";
import {TestingRepository} from "./repositories/testing-repository";
import {TestingController} from "./controller-classes/testing-controller";
import {PostsRepository} from "./repositories/posts-repository";
import {PostsService} from "./domain/posts-service";
import {SecurityDevicesRepository} from "./repositories/security-devices-repository";
import {DevicesService} from "./domain/devices-service";
import {PostsController} from "./controller-classes/posts-controller";
import {CommentsRepository} from "./repositories/comments-repository";
import {CommentsService} from "./domain/comments-service";
import {CommentsController} from "./controller-classes/comments-controller";
import {BlogsDbRepository} from "./repositories/blogs-db-repository";
import {BlogsService} from "./domain/blogs-service";
import {BlogsController} from "./controller-classes/blogs-controller";
import {SecurityDevicesController} from "./controller-classes/security-devices-controller";
import {AuthService} from "./domain/auth-service";
import {AuthController} from "./controller-classes/auth-controller";
import {EmailManager} from "./manager/email-manager";
import {JwtService} from "./application/jwt-service";
import {QueryRepository} from "./queryReposytories/query-Repository";
import {EmailAdapter} from "./adapters/email-adapter";
import {MiddlewareController} from "./middlewares/middleware-controller";
import {Container} from "inversify";
import {BlogsInMemoryRepository} from "./repositories/blogs-in-memory-repository";
import {PostsInMemoryRepository} from "./repositories/posts-in-memory-repository";

// const jwtService = new JwtService();
//
// const commentsRepository = new CommentsRepository();
// const postsRepository = new PostsRepository();
// const blogsRepository = new BlogsDbRepository();
// const blogsService = new BlogsService(blogsRepository);
// const postsService = new PostsService(postsRepository, blogsService, commentsRepository);
//
// export const query = new QueryRepository(commentsRepository, postsRepository);
//
// const videosRepository = new VideosRepository();
// const videosService = new VideosService(videosRepository);
// export const videoController = new VideosController(videosService);
//
// export const blogsController = new BlogsController(blogsService, postsService, query, jwtService);
//
// const usersRepository = new UsersRepository();
// const usersService = new UsersService(usersRepository);
// export const usersController = new UsersController(usersService, query);
//
// const commentsService = new CommentsService(commentsRepository);
// export const commentController = new CommentsController(commentsService, commentsRepository, usersRepository, jwtService);
//
// export const postsController = new PostsController(postsService, usersRepository, postsRepository, commentsService, query, jwtService);
//
// const testingRepository = new TestingRepository();
// export const testingController = new TestingController(testingRepository);
//
// const securityDevicesRepository = new SecurityDevicesRepository();
// const devicesService = new DevicesService(securityDevicesRepository);
// export const securityDevicesController = new SecurityDevicesController(devicesService);
//
// const emailAdapter = new EmailAdapter();
// const emailManager = new EmailManager(emailAdapter);
// const authService = new AuthService(emailManager, usersRepository);
// export const authController = new AuthController(authService, usersService, usersRepository, devicesService, emailManager, jwtService);
// export const middlewareController = new MiddlewareController(jwtService, usersService);

export const container = new Container();

container.bind(AuthController).to(AuthController);
container.bind(BlogsController).to(BlogsController);
container.bind(CommentsController).to(CommentsController);
container.bind(PostsController).to(PostsController);
container.bind(SecurityDevicesController).to(SecurityDevicesController);
container.bind(TestingController).to(TestingController);
container.bind(UsersController).to(UsersController)
container.bind(VideosController).to(VideosController);

container.bind(AuthService).to(AuthService);
container.bind(BlogsService).to(BlogsService);
container.bind(CommentsService).to(CommentsService);
container.bind(DevicesService).to(DevicesService);
container.bind(PostsService).to(PostsService);
container.bind(UsersService).to(UsersService);
container.bind(VideosService).to(VideosService);

container.bind(BlogsDbRepository).to(BlogsDbRepository);
container.bind(BlogsInMemoryRepository).to(BlogsInMemoryRepository);
container.bind(CommentsRepository).to(CommentsRepository);
container.bind(PostsInMemoryRepository).to(PostsInMemoryRepository);
container.bind(PostsRepository).to(PostsRepository);
container.bind(SecurityDevicesRepository).to(SecurityDevicesRepository);
container.bind(TestingRepository).to(TestingRepository);
container.bind(UsersRepository).to(UsersRepository);
container.bind(VideosRepository).to(VideosRepository);
container.bind(QueryRepository).to(QueryRepository);

container.bind(MiddlewareController).to(MiddlewareController);
container.bind(EmailManager).to(EmailManager);
container.bind(JwtService).to(JwtService);
container.bind(EmailAdapter).to(EmailAdapter);