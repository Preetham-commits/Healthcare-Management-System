import mongoose from "mongoose";
import bcrypt from "bcryptjs";

// Define the schema for a User document in MongoDB
const userSchema = new mongoose.Schema(
  {
    email: { type: String, unique: true },
    password: { type: String },
    role: {
      type: String,
      enum: ["PATIENT", "NURSE", "DOCTOR", "ADMIN"],
    },
    firstName: { type: String },
    lastName: { type: String },
    phoneNumber: { type: String },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// Pre-save hook to hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  try {
    const saltRounds = 10;
    this.password = await bcrypt.hash(this.password, saltRounds);
    next();
  } catch (err) {
    next(err);
  }
});

export const User = mongoose.model("User", userSchema);
