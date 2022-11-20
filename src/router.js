import { hash } from "bcrypt";
import express from "express";
import { User } from "./db";
import { encrypt, compare } from "./encrypt";
export const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (email && password) {
      if (await User.countDocuments({ email })) {
        res.status(409).json({ message: "User exists", success: false });
      } else {
        const hash = await encrypt(password);
        const newUser = new User({ ...req.body, password: hash });
        newUser.save(async (e) => {
          if (e) {
            res.status(400).json({ message: e.message, success: false });
          } else {
            const { email, password, ...other } = newUser._doc;
            res.status(200).json({ data: { ...other }, success: true });
          }
        });
      }
    } else {
      res.status(400).json({ message: "Missing credentials", success: false });
    }
  } catch (e) {
    res.status(500).json({ message: e.message, success: false });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (email && password) {
      const user = await User.findOne({ email });
      const match = user ? await compare(user.password, password) : false;
      if (user && match) {
        const { email, password, ...other } = user._doc;
        res.status(200).json({ data: { ...other }, success: true });
      } else {
        res
          .status(403)
          .json({ message: "email or password is incorrect", success: false });
      }
    } else {
      res.status(400).json({ message: "something is missing", success: false });
    }
  } catch (e) {
    res.status(500).json({ message: e.message, success: false });
  }
});
