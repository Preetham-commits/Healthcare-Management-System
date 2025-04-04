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
  // Only hash the password if it's modified or new
  if (!this.isModified("password")) {
    return next();
  }

  try {
    // Generate a salt
    const salt = await bcrypt.genSalt(10);
    // Hash the password with the salt
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    console.error("Error hashing password:", error);
    next(error);
  }
});

// Method to compare passwords
userSchema.methods.comparePassword = async function (candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw error;
  }
};

export const User = mongoose.model("User", userSchema);
