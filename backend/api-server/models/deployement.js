import mongoose from "mongoose";
const deployementSchema = new mongoose.Schema({
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project",
    required: true,
  },
  status: {
    type: String,
    default: "NotStarted",
    enum: ["NotStarted", "Queued", "Progress", "Ready", "Failed"],
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

const Deployement = mongoose.model("Deployement", deployementSchema);
export default Deployement;
