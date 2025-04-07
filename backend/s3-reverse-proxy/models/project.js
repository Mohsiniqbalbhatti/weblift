import mongoose from "mongoose";
const projectSchema = new mongoose.Schema({
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
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
  buildCommand: {
    type: String,
    default: "npm run build",
  },
  gitUrl: {
    type: String,
  },
  subDomain: {
    type: String,
  },
  visits: {
    type: Number,
    default: 0,
  },
  dailyVisits: [
    {
      date: {
        type: Date,
        required: true,
        index: true,
      },
      count: {
        type: Number,
        default: 0,
      },
    },
  ],
  customDomain: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  s3Location: {
    type: String,
    default: "",
  },
  deployment_Type: {
    type: String,
    default: "Github",
    enum: ["Github", "DirectUpload"],
  },
  teamInviteCode: {
    type: String, // added for secure join code
    unique: true,
    sparse: true, //
  },
  teamMembers: [
    {
      userID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      name: {
        type: String,
      },
      access: {
        type: String,
        default: "visitor",
        enum: ["visitor", "editor", "admin"],
      },
    },
  ],
});

const Project = mongoose.model("Project", projectSchema);
export default Project;
