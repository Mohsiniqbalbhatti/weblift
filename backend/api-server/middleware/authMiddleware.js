import jwt from "jsonwebtoken";

export const validateToken = (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ message: "Access Blocked!" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    console.log("AuthMiddleware Error", error);
    return res.status(500).json({ message: "Something Went Wrong!" });
  }
};
