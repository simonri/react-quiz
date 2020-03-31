const User = require("../../../../models/user");

export default async (req, res) => {
  const user = await User.find({});

  try {
    res.status(201).send("Users: " + user);
  } catch (e) {
    res.status(400).send(e);
  }
};
