exports.getLogin = async (req, res) => {
  if (req.user) {
    res.redirect("/");
  } else {
    res.render("login", { title: "Login", user: req.user });
  }
};
