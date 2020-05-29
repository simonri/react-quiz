import mongoose from "mongoose";

const { ObjectId } = mongoose.Types;
const { Schema } = mongoose;

export const schema = {
  userId: {
    type: ObjectId,
    ref: "User",
    required: true,
  },

  name: {
    type: String,
    required: true,
  },

  questions: [
    {
      name: {
        type: String,
        required: true,
      },

      options: {
        type: Array,
        default: ["", "", "", ""],
      },

      correct: {
        type: String,
      },
    },
  ],
};

const quizSchema = new Schema(schema, { timestamps: true });

quizSchema.set("toJSON", {
  transform: function(doc, ret) {
    let retJSON = {
      id: ret._id,
      userId: ret.userId,
      name: ret.name,
      questions: ret.questions,
    };

    return retJSON;
  },
});

mongoose.set("useCreateIndex", true);
mongoose.set("useFindAndModify", false);
export const Quiz = mongoose.model("Quiz", quizSchema, "quizzes");
