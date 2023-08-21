import mongoose from "mongoose";

const skillSchema = mongoose.Schema({
  title: String,
  description: String,
  name: String,
  creator: {
    type: String,
    index: true, // Add an index on the creator field
  },
  percentage: Number,
  creator: String,

  imageFile: String,
  imageFile1: String,
  imageFile2: String,
  imageFile3: String,
  createdAt: {
    type: Date,
    default: new Date(),
  },
});

const SkillModal = mongoose.model("Skill", skillSchema);

export default SkillModal;
