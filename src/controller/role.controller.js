const Role = require("../models/role.model"); // Assuming the path to your role model
const {Snowflake} = require('@theinternetfolks/snowflake')


async function createRole(req, res) {
  try {
    // Validate request body
    const record = req.body;
    const name = record.name;
    // To validate name
    if (!name || name.length < 2) {
        return res.status(400).json({
            status: false,
            errors: [
                {
                    param: name,
                    message: "Name should be at least 2 characters.",
                    code: "INVALID_INPUT"
                }
            ]
        }
        );
      }
    const snowflakeId = await Snowflake.generate().toString();

    // Create role
    const role = await Role.create({ 
        _id:snowflakeId,
        name:record.name,
        
    });

    // Prepare response object
    const response = {
      status: true,
      content: {
        data: {
          id: role._id,
          name: role.name,
          created_at: role.created_at,
          updated_at: role.updated_at,
        },
      },
    };

    // Return the response
    res.status(200).json(response);
  } catch (error) {
    console.log(error)
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

// controller to get all roles
async function getAllRoles(req, res) {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
  
      // Find roles with pagination
      const roles = await Role.find()
        .skip((page - 1) * limit)
        .limit(limit)
        .exec();
  
      // Count total number of documents
      const total = await Role.countDocuments();
  
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
          data: roles,
        },
      };
  
      // Return the response
      res.status(200).json(response);
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
  
module.exports = {createRole,getAllRoles};
