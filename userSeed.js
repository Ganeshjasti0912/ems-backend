import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import User from "./models/User.js";
import connectDB from "./db/db.js";

dotenv.config(); // Load environment variables

const userRegister = async () => {
  await connectDB();

  try {
    const hashedPassword = await bcrypt.hash("admin", 10);
    const newUser = new User({
      name: "Admin",
      email: "admin@gmail.com",
      password: hashedPassword,
      role: "admin"
    });

    const result = await newUser.save();
    console.log("Admin user created:", result);
  } catch (error) {
    console.error("Error registering user:", error);
  }
};

userRegister();
