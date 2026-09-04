import mongoose from "mongoose";


const userSchema = new mongoose.Schema({
  name: String,
  email: {
    type: String,
    unique: true
  },
  password: String
});

const userModel = mongoose.model("UserData", userSchema);

export default userModel