import mongoose from "mongoose";

const tourSchema = mongoose.Schema({
  title: String,
  // name: { type: String, required: true },
  description: String,
  name: String,
  date: String,
  creator: String,
  creator: {
    type: String,
    index: true, // Add an index on the creator field
  },
  imageFile: String,
  imageFile1: String,
  imageFile2: String,
  imageFile3: String,
  createdAt: {
    type: Date,
    default: new Date(),
  },
});

const TourModal = mongoose.model("Tour", tourSchema);

export default TourModal;
