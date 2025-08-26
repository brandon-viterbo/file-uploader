exports.getLogin = async (req, res) => {
  res.render("login", { title: "Login", user: req.user });
};
