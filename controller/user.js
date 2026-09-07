import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'
import userModel from '../model/registration.js';

const JWT_SECRET = process.env.JWT_SECRET

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
    secure: true,
    sameSite: "none",
    maxAge: 7 * 24 * 60 * 60 * 1000
  });

  res.json({
    message: "Login successful"
  });

};


export async function getData(req, res) {
  try {
    const students = await userModel.find();

    res.status(200).json({
      message: "Students fetched successfully",
      data: students
    });

  } catch (error) {
    res.status(500).json({
      message: "Something went wrong",
      error: error.message
    });
  }
}



export async function updateData(req, res) {
  try {
    const id = req.params.id;

    const student = await userModel.findById(id);

    if (!student) {
      return res.status(404).json({
        message: 'Student not found'
      });
    }

    student.name = req.body.name;
    student.email = req.body.email;
    student.password = req.body.password;

    await student.save();

    res.status(200).json(student);

  } catch (error) {
    res.status(500).json({
      message: 'Server error',
      error: error.message
    });
  }
}

export async function deleteData(req, res) {
  try {
    const student = await userModel.findByIdAndDelete(req.params.id);

    if (!student) {
      return res.status(404).json({
        message: 'Student not found'
      });
    }

    res.status(200).json({
      message: 'Student deleted successfully',
      student
    });

  } catch (error) {
    res.status(500).json({
      message: 'Something went wrong',
      error: error.message
    });
  }
}
