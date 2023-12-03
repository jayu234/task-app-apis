import { DataTypes } from "sequelize";
import { sequelize } from "../config/db.js";
import Task from "./Task.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  { modelName: "User", timestamps: true }
);

User.beforeCreate(async (user) => {
  if (user.changed("password")) {
    const hashedPassword = await bcrypt.hash(user.password, 10);
    user.password = hashedPassword;
  }
});

User.prototype.getJwtToken = function () {
  return jwt.sign({ id: this.id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

User.prototype.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// User.hasMany(Task, {
//   foreignKey: "createdBy",
//   as: "tasks",
// });

export default User;
