const authRouter = require("express").Router();
const {
  register,
  login,
  getMe,
} = require("../controller/user.controller");
const { checkToken } = require("../middlewares/JWT");

authRouter.post("/signup", register);
authRouter.post("/signin", login);
authRouter.get("/me", checkToken, getMe);

module.exports = authRouter;
