import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'
import userModel from '../model/registration.js';

const JWT_SECRET = "Arshad"

 export async function register(req, res)  {

  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({
      message: 'Name, email, and password are required'
    });
  }

  const existingUser = await userModel.findOne({ email });

  if (existingUser) {
    return res.status(400).json({
      message: 'User already exists'
    });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await userModel.create({
    name,
    email,
    password: hashedPassword
  });

  res.status(201).json({
    message: 'User registered successfully',
    user: {
      id: user._id,
      name: user.name,
      email: user.email
    }
  });
 };

export async function login (req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      message: 'Email and password are required'
    });
  }

  const user = await userModel.findOne({ email });

  if (!user) {
    return res.status(401).json({
      message: 'Invalid credentials'
    });
  }

  const passwordMatch = await bcrypt.compare(
    password,
    user.password
  );

  if (!passwordMatch) {
    return res.status(401).json({
      message: 'Invalid credentials'
    });
  }

  const token = jwt.sign(
    {
      id: user._id,
      email: user.email
    },
    JWT_SECRET,
    {
      expiresIn: '7d'
    }
  );

  res.cookie("token", token, {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000
  });

  res.json({
    message: "Login successful"
  });
};
