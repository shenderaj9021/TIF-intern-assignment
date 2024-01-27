const memberRouter = require('express').Router()

const {
    addMember ,
    removeMember
} = require("../controller/member.controller")
const { checkToken } = require("../middlewares/JWT");

memberRouter.post("/member",checkToken,addMember)
memberRouter.delete("/member/:id",checkToken,removeMember)

module.exports = memberRouter