const bcrypt = require("bcryptjs");

exports.getSignup = async (req, res) => {
  res.render("signup", { title: "Sign Up", user: false });
};
