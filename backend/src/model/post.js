const mongoose = require("mongoose");

const MAX_IMAGES = 4;
const MAX_IMAGE_SIZE = 2 * 1024 * 1024;

const imageValidator = (value) => {
  if (typeof value !== "string" || value.trim().length === 0) {
    return false;
  }

  const trimmedValue = value.trim();
  const isRemoteUrl = /^https?:\/\//i.test(trimmedValue);
  const isDataUrl = /^data:image\/(png|jpe?g|gif|webp);base64,/i.test(trimmedValue);

  if (!isRemoteUrl && !isDataUrl) {
    return false;
  }

  return trimmedValue.length <= MAX_IMAGE_SIZE;
};

const postSchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "customer",
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: [5, "Title must be at least 5 characters long"],
      maxlength: [120, "Title cannot exceed 120 characters"],
    },
    description: {
      type: String,
      required: true,
      trim: true,
      minlength: [10, "Description must be at least 10 characters long"],
      maxlength: [3000, "Description cannot exceed 3000 characters"],
    },
    category: {
      type: String,
      trim: true,
      maxlength: [60, "Category cannot exceed 60 characters"],
      default: "Development",
    },
    tags: {
      type: [String],
      default: [],
      validate: {
        validator: function (tags) {
          return Array.isArray(tags) && tags.length <= 8;
        },
        message: "You can add up to 8 tags only",
      },
    },
    images: {
      type: [String],
      default: [],
      validate: {
        validator: function (images) {
          return (
            Array.isArray(images) &&
            images.length <= MAX_IMAGES &&
            images.every(imageValidator)
          );
        },
        message:
          "Images must be valid image URLs or data URLs and you can upload up to 4 screenshots",
      },
    },
  },
  {
    timestamps: true,
  },
);

postSchema.pre("validate", function () {
  if (Array.isArray(this.tags)) {
    this.tags = this.tags
      .map((tag) => (typeof tag === "string" ? tag.trim() : ""))
      .filter(Boolean)
      .slice(0, 8);
  }

  if (Array.isArray(this.images)) {
    this.images = this.images
      .map((image) => (typeof image === "string" ? image.trim() : ""))
      .filter(Boolean)
      .slice(0, MAX_IMAGES);
  }

  if (typeof this.category === "string" && this.category.trim().length === 0) {
    this.category = "Development";
  }
});

const Post = mongoose.model("Post", postSchema);

module.exports = { Post };
