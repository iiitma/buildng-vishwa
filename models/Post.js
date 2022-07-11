const mongoose = require("mongoose");
const { Schema } = mongoose;
const PostSchema = new Schema(
  {
    title: {
      type: String,
      required: String,
    },
    subtitle: {
      type: String,
    },
    slug: {
      type: String,
      required: true,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
    },
    post_date: {
      type: Date,
    },
    audience: {
      type: String,
    },
    cover_image: {
      type: String,
    },
    description: {
      type: String,
      default: "",
    },
    body_html: {
      type: String,
      default: "",
    },
    truncated_body_text: {
      type: String,
      default: "",
    },
    wordcount: {
      type: Number,
      default: 0,
    },
    authors: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    reads: {
      type: Number,
      default: 0,
    },
    published: {
      type: Boolean,
      deafult: false,
    },
  },
  {
    timestamps: true,
  }
);

const Post = mongoose.model("Post", PostSchema);

module.exports = Post;
