import prisma from "../config/prisma.js";
import { StatusCodes } from "http-status-codes";
import { formatDate } from "../utils/formatDate.js";

export const createStudent = async (req, res) => {
  try {
    const { name, nim, uid } = req.body;

    const uidExists = await prisma.students.findUnique({
      where: { uid },
    });

    const nimExists = await prisma.students.findFirst({
      where: { nim },
    });

    if (uidExists || nimExists) {
      return res.status(StatusCodes.CONFLICT).json({
        message: uidExists ? "UID Already Exists!" : "NIM Already Exists!",
      });
    }

    const student = await prisma.students.create({
      data: { name, nim, uid },
    });

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

    const duplicate = await prisma.students.findFirst({
      where: {
        OR: [nim ? { nim } : undefined, uid ? { uid } : undefined].filter(
          Boolean,
        ),
        NOT: { id },
      },
    });

    if (duplicate) {
      return res.status(StatusCodes.CONFLICT).json({
        message:
          duplicate.nim === nim ? "NIM Already Exists" : "UID Already Exists",
      });
    }
    if (nim) {
      const nimExists = await prisma.students.findFirst({
        where: {
          nim: nim,
          NOT: { id: id },
        },
      });

      if (nimExists) {
        return res.status(StatusCodes.CONFLICT).json({
          message: "NIM Already Exists",
        });
      }
    }

    if (uid) {
      const uidExists = await prisma.students.findFirst({
        where: {
          uid: uid,
          NOT: { id: id },
        },
      });

      if (uidExists) {
        return res.status(StatusCodes.CONFLICT).json({
          message: "UID Already Exists",
        });
      }
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

    const resUpdate = {
      ...studentUpdate,
      updatedAt: formatDate(studentUpdate.updatedAt),
    };

    res.status(StatusCodes.OK).json({
      message: "Update Student Success",
      data: resUpdate,
    });
  } catch (err) {
    console.log(err);
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
