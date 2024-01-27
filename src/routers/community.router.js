const communityRouter = require("express").Router();
const {
    createCommunity,
    getAllCommunity,
    getAllCommunityMembers,
    getMyOwnedCommunities,
    getMyCommunityMemberships
} = require("../controller/community.controller");
const { checkToken } = require("../middlewares/JWT");

communityRouter.post("/community",checkToken, createCommunity);
communityRouter.get("/community", getAllCommunity);
communityRouter.get("/community/:id/members",getAllCommunityMembers)
communityRouter.get("/community/me/owner",checkToken,getMyOwnedCommunities);
communityRouter.get("/community/me/member",checkToken,getMyCommunityMemberships)
// authRouter.post("/signin", login);
// authRouter.get("/me", checkToken, getMe);

module.exports = communityRouter;
