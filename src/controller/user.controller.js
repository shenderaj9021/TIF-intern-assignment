require("dotenv").config();
const  { Snowflake } = require("@theinternetfolks/snowflake");
const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const { generateToken } = require("../middlewares/JWT");


async function register(req, res) {
  const record = req.body;

  // checking if user already exists

  try {
    const userExist = await User.exists({ email: record.email });
    console.log(userExist);

    //process.env.Salt
    if(userExist){
        res.status(400).json({
          
            status: false,
            errors: [
                {
                    param: record.email,
                    message: "User with this email address already exists.",
                    code: "RESOURCE_EXISTS"
                }
            ]
        
        })
    }else{  
    const hashedPassword = await bcrypt.hash(
      record.password,
      parseInt(process.env.SaltRounds)
    );
    const snowflakeId = await Snowflake.generate().toString();
    const response = await User.create({
      _id : snowflakeId,
      name: record.name,
      email: record.email,
      password: hashedPassword,
    });
    console.log(response)
    const Token = await generateToken(response);
    res.json({
        status:true,
        content:{
        data: {
            id: response._id,
            name: response.name,
            email: response.email,
            created_at: response.created_at.toISOString(), // Assuming MongoDB sets createdAt automatically
          },
          meta: {
            access_token: Token,
          },
        }
    });
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
}

async function login(req, res) {
  const record = req.body;
  const userExist = await User.findOne({ email: record.email }).lean();

  if (!userExist) {
    return res.status(400).json({ msg: "Invalid Credentials" });
  }

  const isMatch = await bcrypt.compare(record.password, userExist.password);

  if (!isMatch) {
    return res.status(400).json({ msg: "Invalid Credentials" });
  }

  const token = await generateToken(userExist);
  res.json({
      status:true,
      content:{
    data: {
        id: userExist._id,
        name: userExist.name,
        email: userExist.email,
        created_at: userExist.created_at.toISOString(), // Assuming MongoDB sets createdAt automatically
      },
      meta: {
        access_token:token,
      },
    }
  });
}

async function getMe(req, res) {
  const userID = req.body.userID;
  const profile = await User.findById(userID);
  if (!profile) {
    return res.status(404).send("User not found");
  }
  res.json({
    status:true,
    content:{
    data:{
        id: profile._id,
        name: profile.name,
        email: profile.email,
        created_at: profile.created_at.toISOString(), // Assuming MongoDB sets createdAt automatically
      },
    }
  })
}

module.exports = { register, login, getMe };
