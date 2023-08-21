import SkillModal from "../models/skill.js";
import mongoose from "mongoose";

export const createSkill = async (req, res) => {
  const Skill = req.body;
  const newSkill = new SkillModal({
    ...Skill,
    creator: req.userId,
    createdAt: new Date().toISOString(),
  });

  try {
    await newSkill.save();
    res.status(201).json(newSkill);
  } catch (error) {
    res.status(404).json({ message: "Something went wrong" });
  }
};

export const getSkills = async (req, res) => {
  const { page } = req.query;
  try {
    // const Skills = await SkillModal.find();
    // res.status(200).json(Skills);

    const limit = 20;
    const startIndex = (Number(page) - 1) * limit;
    const total = await SkillModal.countDocuments({});
    const Skills = await SkillModal.find().limit(limit).skip(startIndex);
    res.json({
      data: Skills,
      currentPage: Number(page),
      totalSkills: total,
      numberOfPages: Math.ceil(total / limit),
    });
  } catch (error) {
    res.status(404).json({ message: "Something went wrong" });
  }
};

export const getSkill = async (req, res) => {
  const { id } = req.params;
  try {
    const Skill = await SkillModal.findById(id);
    res.status(200).json(Skill);
  } catch (error) {
    res.status(404).json({ message: "Something went wrong" });
  }
};

export const getSkillsByUser = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ message: "User doesn't exist" });
  }
  const userSkills = await SkillModal.find({ creator: id });
  res.status(200).json(userSkills);
};

export const deleteSkill = async (req, res) => {
  const { id } = req.params;
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ message: `No Skill exist with id: ${id}` });
    }
    await SkillModal.findByIdAndRemove(id);
    res.json({ message: "Skill deleted successfully" });
  } catch (error) {
    res.status(404).json({ message: "Something went wrong" });
  }
};

export const updateSkill = async (req, res) => {
  const { id } = req.params;
  const {
    title,
    description,
    creator,
    percentage,
    imageFile,
    imageFile1,
    imageFile2,
    imageFile3,
    tags,
  } = req.body;
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ message: `No Skill exist with id: ${id}` });
    }

    const updatedSkill = {
      creator,
      title,
      percentage,
      description,
      tags,
      imageFile,
      imageFile1,
      imageFile2,
      imageFile3,
      _id: id,
    };
    await SkillModal.findByIdAndUpdate(id, updatedSkill, { new: true });
    res.json(updatedSkill);
  } catch (error) {
    res.status(404).json({ message: "Something went wrong" });
  }
};
