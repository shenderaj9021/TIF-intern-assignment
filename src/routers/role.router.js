const roleRouter = require('express').Router()

const {
    createRole,
    getAllRoles
}  = require("../controller/role.controller")

roleRouter.post("/role",createRole)
roleRouter.get("/role",getAllRoles)

module.exports = roleRouter