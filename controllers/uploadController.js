exports.uplaodFile = async (req, res, next) => {
  console.log(`Uploading image ${req.body.image} to folder ${req.params.folderId} owned by user ${req.user.id}`)
  res.redirect("/");
}