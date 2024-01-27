const Router = require("express").Router();
const auth = require("../routers/auth.router");
const communityR = require("../routers/community.router")
const roleR = require("../routers/role.router")
const memberR = require("../routers/member.router")

Router.use("/auth", auth);
Router.use("",communityR);
Router.use("",roleR);
Router.use("",memberR);
module.exports = Router;
