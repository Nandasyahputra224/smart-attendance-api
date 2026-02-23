import express, { urlencoded } from "express";
import dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";
import routes from "./src/routes/route.js";
import authRouter from "./src/routes/auth.routes.js";
import studentsRouter from "./src/routes/students.routes.js";
import attendanceRouter from "./src/routes/attendance.route.js";

dotenv.config();
const app = express();

// var whitelist = ["http://localhost:3000"];
// var corsOptions = {
//   origin: function (origin, callback) {
//     if (whitelist.indexOf(origin) !== -1 || !origin) {
//       callback(null, true);
//     } else {
//       callback(new Error("Not allowed by CORS"));
//     }
//   },
// };

// app.use(cors(corsOptions));

app.use(cors());

app.use(urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use("/", routes);
app.use("/api/auth", authRouter);
app.use("/api/students", studentsRouter);
app.use("/api/attend", attendanceRouter);

const port = process.env.PORT || 3000;
app.listen(port, "0.0.0.0", () => {
  console.log(`server running port ${port}`);
});
