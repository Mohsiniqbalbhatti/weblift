export const resReq = (res, status, msg) => {
  return res.status(status).json({ message: msg });
};
