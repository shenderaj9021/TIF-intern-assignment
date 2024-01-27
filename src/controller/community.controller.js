const {Snowflake} = require('@theinternetfolks/snowflake')
const Community = require("../models/community.model")
const slugify = require("slugify")
const Role = require("../models/role.model")
const Member = require("../models/member.model")

async function createCommunity(req,res) {
    const record = req.body;
    console.log(record)
    try{
        const communityExist = await Community.exists({name:record.name});
        console.log(communityExist);
        if(communityExist){
            res.status(400).json({
          
                status: false,
                errors: [
                    {
                        param: record.email,
                        message: "Community with this name  already exists.",
                        code: "RESOURCE_EXISTS"
                    }
                ]
            
            })
        }else{
            let snowflakeId = await Snowflake.generate().toString();
            const slugifiedName = await slugify(record.name);
            const response = await Community.create({
                _id : snowflakeId,
                name: record.name,
                slug: slugifiedName,
                owner:record.userID
              });
              snowflakeId = await Snowflake.generate().toString();
            const create_role_res = await Role.create({
              _id :snowflakeId,
              name:"Community Admin"
            })

            const create_member_res = await Member.create({
              _id: await Snowflake.generate().toString(),
              community:response._id,
              user:response.owner,
              role:create_role_res._id
            })
            console.log(create_member_res)
            console.log(response)
            res.json({
                status:true,
                content:{
                    data:{
                        id:response._id,
                        name:response.name,
                        slug:response.slug,
                        owner:response.owner,
                        created_at:response.created_at.toISOString(),
                        updated_at:response.updated_at.toISOString()
                    }
                }
            })
        }

    }catch (error) {
        res.status(400).send(error.message);
    }
}


async function getAllCommunity(req,res){
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
    
        // Find communities with pagination
        const communities = await Community.find()
          .skip((page - 1) * limit)
          .limit(limit)
          .populate({
            path: 'owner',
            select: 'id name', // Select only id and name fields for the owner
          })
          .exec();
    
        // Count total number of documents
        const total = await Community.countDocuments();
    
        // Calculate total pages
        const totalPages = Math.ceil(total / limit);
    
        // Prepare response object
        const response = {
          status: true,
          content: {
            meta: {
              total,
              pages: totalPages,
              page,
            },
            data: communities.map(community => ({
              id: community._id,
              name: community.name,
              slug: community.slug,
              owner: {
                id: community.owner.id,
                name: community.owner.name,
              },
              created_at: community.created_at,
              updated_at: community.updated_at,
            })),
          },
        };
    
        // Return the response
        res.json(response);
      } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
      }
}
async function getAllCommunityMembers(req, res) {
    try {
      const communityId = req.params.id;
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
  
      // Find community members with pagination
      const members = await Member.find({ community: communityId })
        .skip((page - 1) * limit)
        .limit(limit)
        .populate({
          path: 'user',
          select: 'id name', // Select only id and name fields for the user
        })
        .populate({
          path: 'role',
          select: 'id name', // Select only id and name fields for the role
        })
        .exec();
  
      // Count total number of documents
      const total = await Member.countDocuments({ community: communityId });
  
      // Calculate total pages
      const totalPages = Math.ceil(total / limit);
  
      // Prepare response object
      const response = {
        status: true,
        content: {
          meta: {
            total,
            pages: totalPages,
            page,
          },
          data: members,
        },
      };
  
      // Return the response
      res.json(response);
    } catch (error) {
        console.log(error)
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }


  async function getMyOwnedCommunities(req, res) {
    try {
      const ownerId = req.body.userID; // Assuming you have the user ID stored in req.user
      const page = parseInt(req.query.page) || 1;
      const perPage = 10;
  
      const totalCount = await Community.countDocuments({ owner: ownerId });
      const totalPages = Math.ceil(totalCount / perPage);
  
      const communities = await Community.find({ owner: ownerId })
        .skip((page - 1) * perPage)
        .limit(perPage);
  
      const formattedCommunities = communities.map(community => ({
        id: community._id,
        name: community.name,
        slug: community.slug,
        owner: community.owner,
        created_at: community.created_at,
        updated_at: community.updated_at,
      }));
  
      res.status(200).json({
        status: true,
        content: {
          meta: {
            total: totalCount,
            pages: totalPages,
            page: page,
          },
          data: formattedCommunities,
        },
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }


  async function getMyCommunityMemberships(req, res) {
    try {
      const userId = req.body.userID; // Assuming you have the user ID stored in req.user
      console.log("usre df ",userId)
      const page = parseInt(req.query.page) || 1;
      const perPage = 10;
  
      const totalCount = await Member.countDocuments({ user: userId });
      const totalPages = Math.ceil(totalCount / perPage);
      const cm = await Member.find({user:userId})
      console.log(cm)
  
      const communityMemberships = await Member.find({ user: userId })
        .populate({
          path: 'community',
          select: 'id name slug owner created_at updated_at', // Select fields from the community
          populate: {
            path: 'owner',
            select: 'id name', // Only select id and name of the owner
          },
        })
        .skip((page - 1) * perPage)
        .limit(perPage);
  
      const formattedMemberships = communityMemberships.map(membership => ({
        id: membership.community._id,
        name: membership.community.name,
        slug: membership.community.slug,
        owner: {
          id: membership.community.owner._id,
          name: membership.community.owner.name,
        },
        created_at: membership.community.created_at,
        updated_at: membership.community.updated_at,
      }));
  
      res.status(200).json({
        status: true,
        content: {
          meta: {
            total: totalCount,
            pages: totalPages,
            page: page,
          },
          data: formattedMemberships,
        },
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
  
module.exports = {createCommunity,getAllCommunity,getAllCommunityMembers,getMyOwnedCommunities,getMyCommunityMemberships}