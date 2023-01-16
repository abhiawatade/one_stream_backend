const express = require("express");

const router = express.Router();

const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const {
  validateName,
  validateEmail,
  validatePassword,
} = require("../utils/validators");
const { where } = require("sequelize");

router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ where: { email: email } });
    if (existingUser) {
      return res.status(403).json({ err: "User already exists" });
    }

    if (!validateName(name)) {
      return res.status(400).json({ err: "Invalid name" });
    }

    if (!validateEmail(email)) {
      return res.status(400).json({ err: "Invalid e" });
    }

    if (!validatePassword(password)) {
      return res.status(400).json({ err: "Invalid" });
    }

    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const user = { email, name, password: hashedPassword };

    const createdUser = await User.create(user);
    const payload = { user: { id: User.id } };
    const bearerToken = await jwt.sign(payload, "SECRET MESSAGE", {
      expiresIn: 36000,
    });

    res.cookie("t", bearerToken, { expire: new Date() + 9999 });

    return res.status(200).json({
      message: `Welcome ${createdUser.name},Your account is successfully created`,
      bearerToken: `${bearerToken}`,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
});

router.post("/signin", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (email.length === 0) {
      return res.status(403).json({ err: "Please enter a valid email" });
    }
    if (password.length === 0) {
      return res.status(403).json({ err: "Please enter a valid password" });
    }

    const existingUser = await User.findOne({ where: { email } });

    if (!existingUser) {
      return res.status(403).json({ err: "User not found" });
    }

    const passwordMatched = await bcrypt.compare(
      password,
      existingUser.password
    );

    if (!passwordMatched) {
      return res.status(403).json({ err: "email or password mismatch" });
    }

    const payload = { user: { id: existingUser.id } };
    const bearerToken = await jwt.sign(payload, "SECRET MESSAGE", {
      expiresIn: 36000,
    });

    res.cookie("t", bearerToken, { expire: new Date() + 9999 });

    return res
      .status(200)
      .json({ message: `Sucessfully Signed in`, bearerToken: bearerToken });
  } catch (error) {
    console.log(">>>>>", error);
    return res.status(500).send(error);
  }
});

router.get("/signout", (req, res) => {
  try {
    res.clearCookie("t");

    return res.status(200).json({ message: "cookie deleted" });
  } catch (error) {
    return res.status(500).send(error);
  }
});

router.post("/forgotpass", async (req, res) => {
  try {
    const email = req.body.email;
    console.log(email);
    const resetToken = crypto.randomBytes(32).toString("hex");
    console.log(resetToken);
    const response = await User.update(
      { resetToken: resetToken },
      { where: { email: email } }
    );
    console.log(response);
    // User.update({ resetToken: resetToken }, { where: { email: email } });
    return res.status(200).json({ resetToken });
  } catch (error) {
    console.log(error);
    return res.status(500).send(error);
  }
});
router.post("/reset-pass", async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;
    const token = req.body.token;

    const user = await User.findOne({
      where: { email: email, resetToken: token },
    });

    user.password = password;

    console.log(user);
    res.status(200).send("success");
  } catch (error) {
    return res.status(500).send(error);
  }
});

router.get("/details", async (req, res) => {
  const email = req.body.email;
  const user = await User.findOne({ email: email });

  res.status(200).send({ user: user });
});

module.exports = router;
