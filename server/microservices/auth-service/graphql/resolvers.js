import jwt from "jsonwebtoken";
import { User } from "../models/User.js";
import bcrypt from "bcryptjs";
import { config } from "../config/config.js";

const JWT_SECRET = process.env.JWT_SECRET;

export const resolvers = {
  Query: {
    //Resolver for fetching the current user based on the JWT in cookies
    currentUser: async (_, __, { user }) => {
      if (!user) return null;
      return await User.findById(user.id);
    },
    me: async (_, __, { token }) => {
      if (!token) throw new Error('Not authenticated');
      const decoded = jwt.verify(token.split(' ')[1], process.env.JWT_SECRET);
      return await User.findById(decoded.userId);
    },
    getUser: async (_, { id }, { token }) => {
      if (!token) throw new Error('Not authenticated');
      const decoded = jwt.verify(token.split(' ')[1], process.env.JWT_SECRET);
      if (decoded.role !== 'ADMIN' && decoded.userId !== id) {
        throw new Error('Not authorized');
      }
      return await User.findById(id);
    },
    getAllUsers: async (_, __, { token }) => {
      if (!token) throw new Error('Not authenticated');
      const decoded = jwt.verify(token.split(' ')[1], process.env.JWT_SECRET);
      if (decoded.role !== 'ADMIN') {
        throw new Error('Not authorized');
      }
      return await User.find();
    },
    getUsersByRole: async (_, { role }, { user }) => {
      if (!user) throw new Error('Not authenticated');
      return await User.find({ role });
    },
    getNurses: async () => {
      return await User.find({ role: 'nurse' });
    },
    getPatients: async () => {
      return await User.find({ role: 'patient' });
    },
    getPatientByNurse: async (_, { nurseId }) => {
      return await User.find({ assignedNurse: nurseId });
    },
    users: async () => {
      return await User.find();
    },
    user: async (_, { id }) => {
      return await User.findById(id);
    }
  },
  Mutation: {
    //Resolver for user login/authentication
    login: async (_, { email, password }) => {
      try {
        const user = await User.findOne({ email });
        if (!user) {
          throw new Error('User not found');
        }

        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
          throw new Error('Invalid password');
        }

        const token = jwt.sign(
          { userId: user.id, role: user.role },
          process.env.JWT_SECRET,
          { expiresIn: '24h' }
        );

        return {
          token,
          user
        };
      } catch (error) {
        console.error('Error in login:', error);
        throw error;
      }
    },

    //Resolver for user logout: clears the token cookie
    logout: () => true,

    register: async (_, { input }) => {
      try {
        console.log("📌 Registration mutation called!");
        console.log("Registration input:", input);
    
        const { email, password, firstName, lastName, role } = input;
    
        // Validate required fields
        if (!email || !password || !firstName || !lastName || !role) {
          throw new Error("All fields are required");
        }
    
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
          console.log("❌ User already exists!");
          throw new Error("User already exists");
        }
    
        // Create new user
        const user = new User({
          email,
          password,
          firstName,
          lastName,
          role: role.toUpperCase(), // Ensure role is uppercase
        });
    
        // Save the user
        const savedUser = await user.save();
        console.log("✅ Saved user:", savedUser);
    
        if (!savedUser) {
          throw new Error("Failed to save user");
        }
    
        // Generate token
        const token = jwt.sign(
          { userId: savedUser._id, role: savedUser.role },
          process.env.JWT_SECRET,
          { expiresIn: "24h" }
        );
    
        console.log("🔑 Generated Token:", token);
    
        // Return the response
        return {
          token,
          user: {
            id: savedUser._id,
            email: savedUser.email,
            role: savedUser.role,
            firstName: savedUser.firstName,
            lastName: savedUser.lastName,
          },
        };
      } catch (error) {
        console.error("❌ Registration error:", error);
        throw new Error(error.message || "Registration failed");
      }
    },

    updateUser: async (_, { id, input }, { token }) => {
      if (!token) throw new Error('Not authenticated');
      const decoded = jwt.verify(token.split(' ')[1], process.env.JWT_SECRET);
      if (decoded.role !== 'ADMIN' && decoded.userId !== id) {
        throw new Error('Not authorized');
      }
      return await User.findByIdAndUpdate(id, input, { new: true });
    },

    assignNurseToPatient: async (_, { patientId, nurseId }, { user }) => {
      if (!user || user.role !== 'nurse') {
        throw new Error('Not authorized');
      }

      const patient = await User.findById(patientId);
      if (!patient || patient.role !== 'patient') {
        throw new Error('Invalid patient');
      }

      const nurse = await User.findById(nurseId);
      if (!nurse || nurse.role !== 'nurse') {
        throw new Error('Invalid nurse');
      }

      patient.assignedNurse = nurseId;
      await patient.save();

      return patient;
    },

    changePassword: async (_, { oldPassword, newPassword }, { user }) => {
      if (!user) {
        throw new Error('Not authenticated');
      }

      const currentUser = await User.findById(user.id);
      const isValid = await bcrypt.compare(oldPassword, currentUser.password);
      
      if (!isValid) {
        throw new Error('Invalid old password');
      }

      currentUser.password = newPassword;
      await currentUser.save();

      return true;
    },

    deleteUser: async (_, { id }, { token }) => {
      if (!token) throw new Error('Not authenticated');
      const decoded = jwt.verify(token.split(' ')[1], process.env.JWT_SECRET);
      if (decoded.role !== 'ADMIN') {
        throw new Error('Not authorized');
      }
      await User.findByIdAndDelete(id);
      return true;
    }
  },
};
