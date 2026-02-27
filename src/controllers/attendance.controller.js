import prisma from "../config/prisma.js";
import { StatusCodes } from "http-status-codes";

export const scanAttendance = async (req, res) => {
  try {

    const { uid } = req.body;

    if (!uid) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        status: "error",
        message: "UID is required",
      });
    }

    const student = await prisma.students.findUnique({
      where: { uid },
    });

    if (!student) {
      return res.status(StatusCodes.NOT_FOUND).json({
        status: "error",
        message: "Card Not Registered",
      });
    }

    await prisma.attendance.create({
      data: {
        studentId: student.id,
      },
    });

    res.status(StatusCodes.CREATED).json({
      status: "success",
      name: student.name,
    });
  } catch (err) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Internal Server Error",
      errors: err,
    });
  }
};
