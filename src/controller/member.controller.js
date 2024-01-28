const express = require('express');
const Community = require("../models/community.model")
const CommunityMember = require('../models/member.model'); // Assuming the path to your community member model
const Member  = require("../models/member.model")
const {Snowflake} = require("@theinternetfolks/snowflake")
const Role = require("../models/role.model")

// Route handler function
async function addMember(req, res) {
    try {
        // Extract data from the request body
        const { community, user, role } = req.body;
        // Check if the current user is the owner (Community Admin) of the community
        const communityInfo = await Community.findById(community);
       
      
        if (!communityInfo || communityInfo.owner !== req.body.userID) {
          return res.status(403).json({ error: "NOT_ALLOWED_ACCESS" });
        }
    
        // Create a new community member entry
        const newMember = await CommunityMember.create({
          _id:await Snowflake.generate().toString(),
          community:community,
          user:user,
          role:role,
        });
        console.log(newMember)
        const response = {
            status: true,
            content: {
              data :{
                id: newMember._id,
                community:community,
                user: user,
                role: role,
                created_at: newMember.created_at
              }
            },
          };
    
        // Return a success response
        res.status(201).json(response);
      } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'Internal Server Error' });
      }
}

// controller to remover memeber
async function removeMember(req, res) {
  try {
    const memberId = req.params.id;
    const currentUser = req.body.userID; 
    console.log(`memberId ${memberId} currentUser ${currentUser}`)
   
  
    const member = await Member.findById(memberId)
    // to check valid member id
    if(!member){
      return res.status(400).json({ error:"No such member found"});
    }
    // to check valid community id
    const community = await Community.findById(member.community);
    if(!community){
      return res.status(403).json({error:"No Such community found "});
    }
    // check whether current user is owner of community or not
    if(req.body.userID===community.owner){
      await Member.findByIdAndRemove(memberId);
      return res.status(200).json({status:true});
    }
   
    // to check whether user is moderator or not
    const userMember = await Member.findOne({user:req.body.userID,community:member.community})
    if(!userMember){
      return res.status(200).json({status:true});
    }
    const userRole = await Role.findById(userMember.role);
    if(userRole.name==="Community Moderator"){
     await Member.findByIdAndRemove(memberId);
      return res.status(200).json({status:true});
    }
    return res.status(403).json({ error: "NOT_ALLOWED_ACCESS" });
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Internal Server Error' });
  }
}



module.exports = {addMember,removeMember};
