import {container} from "../composition-root";
import {MiddlewareController} from "./middleware-controller";

const middlewareController = container.resolve(MiddlewareController);

export const middleware = middlewareController.middleWare.bind(middlewareController);

export const checkToken = middlewareController.checkToken.bind(middlewareController);

export const checkRefreshToken = middlewareController.checkRefreshToken.bind(middlewareController);

export const aut = middlewareController.aut.bind(middlewareController);