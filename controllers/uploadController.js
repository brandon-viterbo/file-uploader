exports.getUploads = async (req, res) => {
  if (req.user) {
    res.render("upload", { title: "Upload Image", user: req.user });
  } else {
    res.redirect("login");
  }
};
