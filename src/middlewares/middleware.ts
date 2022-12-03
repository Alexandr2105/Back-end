import {middlewareController} from "../composition-root";

export const middleware = middlewareController.middleWare.bind(middlewareController);

export const checkToken = middlewareController.checkToken.bind(middlewareController);

export const checkRefreshToken = middlewareController.checkRefreshToken.bind(middlewareController);

export const aut = middlewareController.aut.bind(middlewareController);