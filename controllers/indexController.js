exports.getIndex = async (req, res) => {
  res.render("index", {
    title: "File Uploader",
  });
};
