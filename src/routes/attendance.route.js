import express from "express";
import {
  listAttendances,
  scanAttendance,
} from "../controllers/attendance.controller.js";
// import { authUser, authAdmin } from "../middlewares/auth.middleware.js";

const routes = express.Router();
const routesObject = [
  {
    method: "post",
    path: "/scan",
    handler: [scanAttendance],
  },
  {
    method: "get",
    path: "/",
    handler: [listAttendances],
  },
  //   {
  //     method: "get",
  //     path: "/:id",
  //     handler: [detailStudent],
  //   },
  //   {
  //     method: "patch",
  //     path: "/:id",
  //     handler: [updateStudent],
  //   },
  //   {
  //     method: "delete",
  //     path: "/:id",
  //     handler: [deleteStudent],
  //   },
];

routesObject.forEach(({ method, path, handler }) => {
  routes[method](path, handler);
});

export default routes;
