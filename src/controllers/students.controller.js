import prisma from "../config/prisma.js";
import { StatusCodes } from "http-status-codes";
import { formatDate } from "../utils/formatDate.js";

export const createStudent = async (req, res) => {
  try {
    const { name, nim, uid } = req.body;

    const student = await prisma.students.create({
      data: { name, nim, uid },
    });

    // if (!uid) {
    // }

    res.status(StatusCodes.CREATED).json({
      message: "Additional Student Success",
      data: student,
    });
  } catch (err) {
    // console.log(err);
    res.status(StatusCodes.BAD_REQUEST).json({
      message: "Internal Server Error",
      errors: err,
    });
  }
};

export const listStudents = async (req, res) => {
  try {
    const students = await prisma.students.findMany();

    res.status(StatusCodes.OK).json({
      data: students,
    });
  } catch (err) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Internal Server Error",
      errors: err,
    });
  }
};

export const detailStudent = async (req, res) => {
  try {
    const { id } = req.params;

    const student = await prisma.students.findUnique({
      where: { id },
    });

    if (!student) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: "Student Not Found",
      });
    }

    const resFormatDate = {
      ...student,
      createdAt: formatDate(student.createdAt),
      updatedAt: formatDate(student.updatedAt),
    };

    res.status(StatusCodes.OK).json({
      message: "Get Detail Student Success",
      data: resFormatDate,
    });
  } catch (err) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Internal Server Error",
      errors: err,
    });
  }
};

export const updateStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, nim, uid } = req.body;

    const student = await prisma.students.findUnique({
      where: { id },
    });

    if (!student) {
      return res.status(StatusCodes.NOT_FOUND).json({
        message: "Student Not Found",
      });
    }

    if ((nim && nim == student.nim) || uid & (uid == student.uid)) {
      return res.status(StatusCodes.CONFLICT).json({
        message: "NIM or UID Already Exists",
      });
    }

    const studentUpdate = await prisma.students.update({
      where: { id },
      data: {
        name: name ?? student.name,
        nim: nim ?? student.nim,
        uid: uid ?? student.uid,
      },
      select: {
        id: true,
        name: true,
        nim: true,
        uid: true,
        updatedAt: true,
      },
    });

    const resFormatDate = {
      ...studentUpdate,
      updatedAt: formatDate(studentUpdate.updatedAt),
    };

    res.status(StatusCodes.OK).json({
      message: "Update Student Success",
      data: resFormatDate,
    });
  } catch (err) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Internal Server Error",
      errors: err,
    });
  }
};

export const deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.students.delete({
      where: { id },
    });

    res.status(StatusCodes.NO_CONTENT).json();
  } catch (err) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      message: "Internal Server Error",
      error: err,
    });
  }
};
