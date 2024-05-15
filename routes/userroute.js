const express = require("express");
const User = require("../models/usermodel");

const { fetchuser } = require("../middlewares/authentication");

const router = express.Router();

router
  .get("/", fetchuser, async (req, res) => {
    console.log(req.user);

    res.render("home", { user: req.user });
  })
  .get("/login", (req, res) => {
    return res.render("login");
  })
  .post("/login", async (req, res) => {
    const { email, password } = req.body;
    try {
      const token = await User.comparePassword(email, password);
      if (token) {
        res.cookie("token", token);
        return res.redirect("/");
      } else
        return res
          .status(400)
          .render("login", { error: "Invalid credentials" });
    } catch (error) {
      return res.status(404).render("login", { error: error });
    }
  })
  .get("/signup", (req, res) => {
    return res.render("signup");
  })
  .post("/signup", async (req, res) => {
    const { name, email, password } = req.body;
    let user = await User.findOne({ email: email });
    try {
      if (!user) {
        user = await User.create({
          name: name,
          email: email,
          password: password,
        });
        console.log("User created successfully:", user);
      }
      res.redirect("/login");
    } catch (err) {
      console.error("Error creating user:", err);
      // Handle other errors
    }
  })

  .get("/logout", (req, res) => {
    res.clearCookie("token");
    res.redirect("/");
  });

module.exports = router;
