import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    match: [
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      "Please enter a valid email",
    ],
  },
  password: {
    type: String,
  },
  githubID: {
    type: String,
  },
  gtihubToken: {
    type: String,
  },
  isVarified: {
    type: Boolean,
    default: false,
  },
  projects: {
    type: Array,
  },
  deployments: {
    type: Array,
  },
});

const User = mongoose.model("User", userSchema);
export default User;
