import mongoose from "mongoose";
const projectSchema = new mongoose.Schema({
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    // required: true,
  },
  project_Name: {
    type: String,
    required: true,
    unique: true,
  },
  gitUrl: {
    type: String,
    required: true,
  },
  subDomain: {
    type: String,
  },
  customDomain: {
    type: String,
  },
  visits: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

const Project = mongoose.model("Project", projectSchema);
export default Project;
