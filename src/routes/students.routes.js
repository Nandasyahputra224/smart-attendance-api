import express from "express";
import {
  createStudent,
  listStudents,
  detailStudent,
  updateStudent,
  deleteStudent,
} from "../controllers/students.controller.js";
// import { authUser, authAdmin } from "../middlewares/auth.middleware.js";

const routes = express.Router();
const routesObject = [
  {
    method: "get",
    path: "/",
    handler: [listStudents],
  },
  {
    method: "post",
    path: "/add",
    handler: [createStudent],
  },
  {
    method: "get",
    path: "/:id",
    handler: [detailStudent],
  },
  {
    method: "patch",
    path: "/:id",
    handler: [updateStudent],
  },
  {
    method: "delete",
    path: "/:id",
    handler: [deleteStudent],
  },
];

routesObject.forEach(({ method, path, handler }) => {
  routes[method](path, handler);
});

export default routes;
