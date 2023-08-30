import mongoose from "mongoose";

const projectSchema = mongoose.Schema({
  title: String,
  toptext1: String,
  toptext2: String,
  description: String,
  imgurl: String,
  name: String,
  creator: {
    type: String,
    index: true, // Add an index on the creator field
  },
  link: String,
  imgurl: String,
  imgurl1: String,
  imgurl2: String,
  imageFile: String,
  imageFile1: String,
  imageFile2: String,
  imageFile3: String,
  createdAt: {
    type: Date,
    default: new Date(),
  },
});

const ProjectModal = mongoose.model("Project", projectSchema);

export default ProjectModal;
