const express = require("express");
const z = require("zod");
const router = express.Router();
const { User, Account } = require("../db");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config");
const bcrypt = require("bcrypt");
const { authMiddleware } = require("../middleware");

// zod Schema
const signupSchema = z.object({
  username: z.string().email().max(100),
  password: z.string().max(100).min(6),
  firstName: z.string().max(100).min(1),
  lastName: z.string().max(100).min(1),
});




router.post("/signup", async (req, res) => {
  try {
    const validateData = signupSchema.safeParse(req.body);

    if (!validateData.success) {
      return res.status(411).json({
        message: "Invalid inputs",
        errors: validateData.error.errors,
      });
    }

    const { username, password, firstName, lastName } = validateData.data;

    const hashedPassword = await bcrypt.hash(password, 10);

    const existingUser = await User.findOne({
      username: username,
    });

    if (existingUser) {
      return res.status(409).json({
        message: "User already exists",
      });
    }

    const newUser = await User.create({
      username: username,
      password: hashedPassword,
      firstName: firstName,
      lastName: lastName,
    });

    const userId = newUser._id;

    const token = jwt.sign(
      {
        userId,
      },
      JWT_SECRET
    );

    // Create a new Account with Some Balance
    await Account.create({
      userId : userId,
      balance : 1 + Math.random() * 1000
    });

    
    return res.json({
      message: "User Created Successfully",
      token: token,
    });
  } catch (error) {
      console.error("Signup error:", error); 
    return res.status(500).json({
      message: "Internal Server Error",
      error : error.message
    });
  }
});

const signinSchema = z.object({
  username: z.string().email(),
  password: z.string(),
});




router.post("/signin", async (req, res) => {
  const validateData = signinSchema.safeParse(req.body);
  if (!validateData.success) {
    return res.status(411).json({
      message: "Error while logging in",
    });
  }

  const { username, password } = validateData.data;

  // Check User
  const user = await User.findOne({ username: username });
  if (!user) {
    return res.status(404).json({
      message: "User not found",
    });
  }

  // Compare Password with [hashed password -> stored in the db]
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return res.status(401).json({
      message: "Invalid Password",
    });
  }

  // Generate JWT token
  const token = jwt.sign({ userId: user._id }, JWT_SECRET);
  return res.json({
    message: "Login successful",
    token: token,
  });
});

const updateBody = z.object({
  password: z.string().optional(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
});



router.put("/", authMiddleware, async (req, res) => {
  const success = updateBody.safeParse(req.body);
  if (!success.success) {
    return res.status(411).json({
      message: "Error while updating the information",
    });
  }
  await User.updateOne({ _id: req.userId }, req.body);

  return res.status(200).json({
    message: "Updated Successfully",
  });
});



router.get("/bulk", async (req, res) => {
  const filter = req.query.filter || "";

  // mongo query
  const users = await User.find({
    $or: [
      {
        firstName: {
          $regex: filter,
        },
      },
      {
        lastName: {
          $regex: filter,
        },
      },
    ],
  });

  res.json({
    user : users.map(user=>({
      username : user.username,
      firstName : user.firstName,
      lastName : user.lastName,
      _id : user._id
    }))
  });
});


module.exports = router;