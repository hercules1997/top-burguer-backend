import { Router } from "express"
import multer from "multer"
import multerConfig from "./config/multer"
import authMiddleware from "./app/middlewares/auth"

import ProductController from "./app/controllers/ProductController"
import SessionController from "./app/controllers/SessionController"
import CategoryController from "./app/controllers/CategoryController"
import UserController from "./app/controllers/UserController"
import OrderController from "./app/controllers/OrderController"

const upload = multer(multerConfig)
const routes = new Router()

/*
ROTA PARA CRIAÇÃO DE USUÁRIOS
*/
routes.post("/users", UserController.store)

/*
 ROTA PARA REALIZAR O LOGIN
*/
routes.post("/sessions", SessionController.store)

/*
 AUTENTICAÇÃO COM JWT (TODAS AS ROTAS EMBAIXO DEPENDE DESSA AUTENTICAÇÃO)
 */
routes.use(authMiddleware)

/*
 ROTAS DOS PRODUTOS
 */
routes.post("/products", upload.single("file"), ProductController.store)
routes.get("/products", ProductController.index)
routes.put("/products/:id", upload.single("file"), ProductController.update)

/*
ROTAS DAS CATEGORIAS
*/
routes.post("/categories", upload.single("file"), CategoryController.store)
routes.get("/categories", CategoryController.index)
routes.put("/categories/:id", upload.single("file"), CategoryController.update)

/* 
ROTAS DAS ORDENS DOS PEDIDOS
*/
routes.post("/orders", OrderController.store)
routes.put("/orders/:id", OrderController.update)
routes.get("/orders", OrderController.index)

export default routes
