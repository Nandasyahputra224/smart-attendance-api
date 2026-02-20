import jwt from "jsonwebtoken";

export const authUser = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Unauthorized token missing",
      });
    }

    const token = authHeader.split(" ")[1];
    const decode = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decode;

    next();
  } catch (err) {
    console.log(err);
    res.status(403).json({
      message: "Forbidden",
    });
  }
};

export const authAdmin = (req, res, next) => {
  try {
    const role = req.user?.role;
    if (role !== "Admin") {
      return res.status(403).json({
        message: "Access denied: Admin only",
      });
    }
    next();
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};
