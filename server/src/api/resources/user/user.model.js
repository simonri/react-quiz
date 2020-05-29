import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { randomBytes } from "crypto";

const { Schema } = mongoose;
const { ObjectId } = mongoose.Types;
const SALT_WORK_FACTOR = 10;

export const schema = {
  email: {
    required: [true, "Email is required."],
    type: String,
    unique: true,
  },

  lastLogin: {
    default: Date.now(),
    required: true,
    type: Date,
  },

  loginCount: {
    default: 0,
    type: Number,
  },

  password: {
    required: [true, "Password is required."],
    type: String,
  },

  resetToken: {
    required: false,
    type: String,
  },

  token: {
    type: String,
    required: false,
  },

  quizzes: [
    {
      ref: "Quiz",
      type: ObjectId,
    },
  ],
};

const userSchema = new Schema(schema, { timestamps: true });

userSchema.pre("save", function(next) {
  const user = this;
  if (!user.isModified("password")) return next();

  bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
    if (err) return next(err);

    bcrypt.hash(user.password, salt, function(err, hash) {
      if (err) return next(err);
      user.password = hash;
      next();
    });
  });
});

userSchema.methods.comparePassword = function(candidatePassword, cb) {
  if (this.resetToken !== undefined) {
    return cb(null, false);
  }
  bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
    if (err) return cb(err);
    cb(null, isMatch);
  });
};

userSchema.methods.resetPassword = function() {
  return new Promise((res, rej) => {
    randomBytes(32, (err, buf) => {
      if (err) {
        const err = new Error("Internal error");
        err.status = 500;
        rej(err);
      }

      const generateToken = () => {
        const token = buf.toString("hex");
        User.findOne({ resetToken: token }, (err, user) => {
          if (err) {
            const err = new Error("Internal error");
            err.status = 500;
            rej(err);
          }

          if (user) return generateToken();

          this.resetToken = token;
          res();
        });
      };
      generateToken();
    });
  });
};

userSchema.methods.followCompany = function(cik) {
  if (this.following.includes(cik)) {
    const err = new Error("Company already followed");
    err.status = 400;
    throw err;
  }
  this.following.push(cik);
};

userSchema.methods.unfollowCompany = function(cik) {
  if (!this.following.includes(cik)) {
    const err = new Error("Company not followed");
    err.status = 400;
    throw err;
  }
  const cikIndex = this.following.indexOf(cik);
  this.following.splice(cikIndex, 1);
};

userSchema.set("toJSON", {
  transform: function(doc, ret) {
    let retJSON = {
      email: ret.email,
      id: ret._id,
      lastLogin: ret.lastLogin,
      loginCount: ret.loginCount,
      quizzes: ret.quizzes,
    };

    return retJSON;
  },
});

mongoose.set("useCreateIndex", true);
mongoose.set("useFindAndModify", false);
export const User = mongoose.model("User", userSchema, "users");
