import SkillModal from "../models/skill.js";
import mongoose from "mongoose";
import cache from "memory-cache"; // Adjust the caching library as needed

export const createSkill = async (req, res) => {
  const Skill = req.body;
  const newSkill = new SkillModal({
    ...Skill,
    creator: req.userId,
    createdAt: new Date().toISOString(),
  });

  try {
    await newSkill.save();

    // Update the cache with the newly created Skill
    const prefix = "Skills_";
    const keys = cache.keys();
    keys.forEach((key) => {
      if (key.startsWith(prefix)) {
        cache.del(key);
      }
    });

    res.status(201).json(newSkill);
  } catch (error) {
    res.status(404).json({ message: "Something went wrong" });
  }
};

export const deleteSkill = async (req, res) => {
  const { id } = req.params;
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(404)
        .json({ message: `No Skill exists with id: ${id}` });
    }

    // Remove the Skill from the database
    await SkillModal.findByIdAndRemove(id);

    // Update the corresponding cache entries for all Skill cards
    const prefix = "Skills_";
    const keys = cache.keys();
    keys.forEach((key) => {
      if (key.startsWith(prefix)) {
        cache.del(key);
      }
    });

    res.json({ message: "Skill deleted successfully" });
  } catch (error) {
    res.status(404).json({ message: "Something went wrong" });
  }
};

export const updateSkill = async (req, res) => {
  const { id } = req.params;
  const {
    title,
    toptext1,
    toptext2,
    description,
    creator,
    imageFile,
    imageFile1,
    imageFile2,
    imageFile3,
    link,
  } = req.body;
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(404)
        .json({ message: `No Skill exists with id: ${id}` });
    }

    // Update the Skill in the database
    const updatedSkill = {
      creator,
      title,
      toptext1,
      toptext2,
      description,
      link,
      imageFile,
      imageFile1,
      imageFile2,
      imageFile3,
      _id: id,
    };
    await SkillModal.findByIdAndUpdate(id, updatedSkill, { new: true });

    // Update the corresponding cache entries for all Skill cards
    const prefix = "Skills_";
    const keys = cache.keys();
    keys.forEach((key) => {
      if (key.startsWith(prefix)) {
        cache.del(key);
      }
    });

    res.json(updatedSkill);
  } catch (error) {
    res.status(404).json({ message: "Something went wrong" });
  }
};
export const getSkills = async (req, res) => {
  const { page } = req.query;
  try {
    const limit = 7;
    const startIndex = (Number(page) - 1) * limit;

    // Check if data is present in cache for the specific page
    const cachedData = cache.get(`Skills_page_${page}`);
    if (cachedData) {
      return res.json(cachedData);
    }

    // Query the database to fetch the Skills for the specific page and get the total count simultaneously
    const [Skills, total] = await Promise.all([
      SkillModal.find().limit(limit).skip(startIndex).lean(),
      SkillModal.countDocuments({}),
    ]);

    // Update cache with the fetched data for the specific page
    const cachedSkills = {
      data: Skills,
      currentPage: Number(page),
      totalSkills: total,
      numberOfPages: Math.ceil(total / limit),
    };
    cache.put(`Skills_page_${page}`, cachedSkills);

    res.json(cachedSkills);
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
  const cacheKey = `Skills_user_${id}`;
  const cachedData = cache.get(cacheKey);
  if (cachedData) {
    return res.json(cachedData);
  }

  const userSkills = await SkillModal.find({ creator: id });

  // Update cache with the fetched data for the specific user
  cache.put(cacheKey, userSkills);

  res.status(200).json(userSkills);
};
