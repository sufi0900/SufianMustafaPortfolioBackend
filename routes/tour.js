import express from "express";
const router = express.Router();
import auth from "../middleware/auth.js";

import {
  createTour,
  deleteTour,
  getTour,
  getTours,
  getToursByUser,
  updateTour,
  getAllTours,
  getToursBySearch, // Add this import
} from "../controllers/tour.js";
router.get("/search", getToursBySearch);
router.get("/pageTours", getTours);
router.get("/:id", getTour);

router.post("/", auth, createTour);
router.delete("/:id", auth, deleteTour);
router.patch("/:id", auth, updateTour);
router.get("/userTours/:id", auth, getToursByUser);
router.get("/", getAllTours); // Define the route for fetching all tours

export default router;
