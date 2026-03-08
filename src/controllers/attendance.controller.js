import { Status } from "@prisma/client";
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

    const { now, hours, minutes } = getWIBTime();

    const PRESENT_START_HOUR = 7;
    const PRESENT_END_HOUR = 8;
    const PRESENT_END_MINUTE = 15;

    const isPresent =
      hours >= PRESENT_START_HOUR &&
      (hours < PRESENT_END_HOUR ||
        (hours === PRESENT_END_HOUR && minutes <= PRESENT_END_MINUTE));

    const status = isPresent ? Status.Hadir : Status.Absen;

    const startOfDay = new Date(now);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(now);
    endOfDay.setHours(23, 59, 59, 999);

    const existingScan = await prisma.attendance.findFirst({
      where: {
        studentId: student.id,
        scanTime: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
    });

    if (existingScan) {
      return res.status(StatusCodes.CONFLICT).json({
        status: "error",
        message: `${student.name} sudah melakukan scan hari ini`,
      });
    }

    await prisma.attendance.create({
      data: {
        status: status,
        studentId: student.id,
      },
    });

    res.status(StatusCodes.CREATED).json({
      name: student.name,
      status: status,
    });
  } catch (err) {
    console.log(err);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Internal Server Error",
      errors: err,
    });
  }
};

export const listAttendances = async (req, res) => {
  try {
    const attendance = await prisma.attendance.findMany();

    res.status(StatusCodes.OK).json({
      data: attendance,
    });
  } catch (err) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Internal Server Error",
      errors: err,
    });
  }
};
