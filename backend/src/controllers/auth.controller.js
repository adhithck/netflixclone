import bcrypt from "bcryptjs";
import User from "../models/User.model.js";
import generateToken from "../utils/generateToken.js";

// ================= HELPER =================
const isPremiumActive = (user) => {
  if (!user.premiumUntil) return false;
  return new Date(user.premiumUntil) > new Date();
};

// ================= REGISTER =================
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(409).json({ message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // ⭐ 7-DAY TRIAL
    const trialUntil = new Date();
    trialUntil.setDate(trialUntil.getDate() + 7);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      isAdmin: false,

      // ⭐ TRIAL PREMIUM
      isPremium: true,
      premiumUntil: trialUntil,
    });

    res.status(201).json({
      message: "Registered successfully ✅",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        isPremium: isPremiumActive(user),
        premiumUntil: user.premiumUntil,
      },
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ================= LOGIN =================
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    res.status(200).json({
      message: "Login success ✅",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        isPremium: isPremiumActive(user),
        premiumUntil: user.premiumUntil,
      },
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ================= PROFILE =================
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      ...user.toObject(),
      isPremium: isPremiumActive(user),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
