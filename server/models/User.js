const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { isMongoConnected, inMemoryUsers, generateId } = require('./store');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/\S+@\S+\.\S+/, 'Please provide a valid email address'],
    },
    passwordHash: {
      type: String,
      required: [true, 'Password is required'],
    },
    targetRole: {
      type: String,
      default: 'Full Stack Software Engineer',
      trim: true,
    },
    themePreference: {
      type: String,
      enum: ['light', 'dark'],
      default: 'dark',
    },
    customApiKey: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.passwordHash);
};

userSchema.methods.toJSON = function () {
  const obj = this.toObject ? this.toObject() : { ...this };
  delete obj.passwordHash;
  return obj;
};

const MongooseUser = mongoose.model('User', userSchema);

// Adaptive User Service wrapper
class UserRepository {
  static async findByEmail(email) {
    const cleanEmail = email.toLowerCase().trim();
    if (isMongoConnected()) {
      return MongooseUser.findOne({ email: cleanEmail });
    }
    for (const user of inMemoryUsers.values()) {
      if (user.email.toLowerCase() === cleanEmail) {
        return user;
      }
    }
    return null;
  }

  static async findById(id) {
    if (isMongoConnected()) {
      return MongooseUser.findById(id);
    }
    return inMemoryUsers.get(id?.toString()) || null;
  }

  static async create({ name, email, password, targetRole, themePreference }) {
    const passwordHash = await bcrypt.hash(password, 10);
    const cleanEmail = email.toLowerCase().trim();

    if (isMongoConnected()) {
      const user = new MongooseUser({
        name,
        email: cleanEmail,
        passwordHash,
        targetRole: targetRole || 'Full Stack Software Engineer',
        themePreference: themePreference || 'dark',
      });
      return await user.save();
    }

    const id = generateId();
    const newUser = {
      _id: id,
      name,
      email: cleanEmail,
      passwordHash,
      targetRole: targetRole || 'Full Stack Software Engineer',
      themePreference: themePreference || 'dark',
      customApiKey: '',
      createdAt: new Date(),
      updatedAt: new Date(),
      comparePassword: async function (candidate) {
        return bcrypt.compare(candidate, this.passwordHash);
      },
      toJSON: function () {
        const copy = { ...this };
        delete copy.passwordHash;
        return copy;
      },
    };
    inMemoryUsers.set(id, newUser);
    return newUser;
  }

  static async updateById(id, updates) {
    if (isMongoConnected()) {
      return MongooseUser.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
    }
    const user = inMemoryUsers.get(id?.toString());
    if (!user) return null;

    if (updates.password) {
      user.passwordHash = await bcrypt.hash(updates.password, 10);
      delete updates.password;
    }
    Object.assign(user, updates, { updatedAt: new Date() });
    inMemoryUsers.set(id?.toString(), user);
    return user;
  }

  static async deleteById(id) {
    if (isMongoConnected()) {
      return MongooseUser.findByIdAndDelete(id);
    }
    const exists = inMemoryUsers.has(id?.toString());
    inMemoryUsers.delete(id?.toString());
    return exists;
  }
}

module.exports = {
  User: MongooseUser,
  UserRepository,
};
