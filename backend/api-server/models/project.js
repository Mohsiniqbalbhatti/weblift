import mongoose from "mongoose";
const projectSchema = new mongoose.Schema({
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    // required: true,
  },
  CreatedByName: {
    type: String,
    required: true,
  },
  project_Name: {
    type: String,
    required: true,
    unique: true,
  },
  buildComand: {
    type: String,
    default: "npm run build",
  },
  gitUrl: {
    type: String,
    required: true,
  },
  subDomain: {
    type: String,
  },
  visits: {
    type: Number,
    default: 0,
  },
  customDomain: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  deployment_Type: {
    type: String,
    default: "Gtihub",
  },
});

const Project = mongoose.model("Project", projectSchema);
export default Project;
