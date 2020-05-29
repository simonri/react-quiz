import jwt from "jsonwebtoken";
import config from "../../config";
import { User } from "../resources/user/user.model";
import { validateAuthRoute } from "./validate";

const JWT_SECRET = config.secrets.JWT_SECRET;

export const register = [
  validateAuthRoute,
  async (req, res) => {
    const { email, password, ...rest } = req.body;

    try {
      let user = await User.findOne({ email });

      if (user) return res.sendStatus(409);
      let newUser = new User({ email, password, ...rest });

      try {
        await newUser.save();
        res.sendStatus(201);
      } catch (err) {
        const _message = err.message; // log this to somewhere
        res.sendStatus(500);
      }
    } catch (err) {
      res.status(500).send(err);
    }
  }
];

export const login = [
  validateAuthRoute,
  async (req, res) => {
    const { email, password } = req.body;

    try {
      let oldUser = await User.findOneAndUpdate(
        { email },
        { lastLogin: Date.now(), $inc: { loginCount: 1 } },
        { new: false }
      ).exec();
      if (!oldUser) return res.sendStatus(409);

      oldUser.comparePassword(password, (err, isMatch) => {
        if (err) {
          return res.sendStatus(500);
        }

        if (!isMatch) {
          return res.sendStatus(401);
        }

        const token = jwt.sign({ id: oldUser._id }, JWT_SECRET, {
          expiresIn: 86400
        });

        const payload = { user: oldUser, token };
        res.status(200).json(payload);
      });
    } catch (err) {
      res.status(500).send(err);
    }
  }
];

export const protect = (req, res, next) => {
  if (req.body.resetToken) return next();

  if (!req.headers.authorization) {
    return res.sendStatus(400);
  }

  let token = req.headers.authorization;
  token = token.replace("Bearer ", "");
  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      next(err);
      return res.sendStatus(401);
    }

    req.payload = decoded;
    return next();
  });
};

export const changePassword = async (req, res) => {
  const { email, oldPassword, newPassword, resetToken } = req.body;

  try {
    const user = await User.findOne(
      resetToken !== null ? { resetToken } : { email }
    );
    if (!user) return res.sendStatus(409);

    const updatePassword = () => {
      user.password = newPassword;
      try {
        user.save();
        res.status(200).send(user);
      } catch (err) {
        res.sendStatus(500);
      }
    };

    if (resetToken) {
      updatePassword();

      user.resetToken = undefined;
      await user.save();

      return;
    }

    user.comparePassword(oldPassword, (err, isMatch) => {
      if (err) {
        return res.sendStatus(500);
      }
      if (!isMatch) {
        return res.sendStatus(401);
      }

      updatePassword();
    });
  } catch (err) {
    res.sendStatus(500);
  }
};
