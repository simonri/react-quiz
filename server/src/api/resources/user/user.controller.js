import { User } from "./user.model";
import { protect } from "../../modules/auth";
import { validateUpdateUser } from "../../modules/validate";

export const getUserFromToken = async (req, res, next) => {
  try {
    const user = await User.findById(req.payload.id);
    if (!user)
      return next({
        status: 401,
        message: "Unauthorised",
      });
    res.locals.user = user.toJSON();
    next();
  } catch (e) {
    next(e);
  }
};

export const getOneUser = [
  protect,
  getUserFromToken,
  async (req, res) => {
    const { user } = res.locals;
    res.status(200).json(user.toJSON());
  },
];

export const updateUser = [
  validateUpdateUser,
  protect,
  getUserFromToken,
  async (req, res, next) => {
    const { user } = res.locals;
    const update = req.body;

    if (update.email) return res.status(401).send("Email change not allowed");
    if (update.password)
      return res.status(401).send("Cannot be changed from this endpoind");
    if (update.following)
      return res.status(401).send("Cannot be changed from this endpoind");

    try {
      let oldUser = await User.findOneAndUpdate({ _id: user.id }, update);

      try {
        let newUser = await User.findOne({ _id: oldUser.id });
        res.status(200).json(newUser.toJSON());
      } catch (e) {
        next(e);
      }
    } catch (e) {
      next(e);
    }
  },
];
