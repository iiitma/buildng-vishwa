const passport = require("passport");
const { SUPER_ADMIN } = require("../config");
const { info, success, error } = require("consola");
const bcrypt = require("bcryptjs");
const Roles = require("../models/Roles");
const User = require("../models/User");
const { zeroPad } = require("./misc");

/**
 * @DESC Passport middleware
 */

const authorization = passport.authenticate("jwt", { session: false });

/**
 * @DESC Check Role Middleware
 */

const checkRole = (roles) => (req, res, next) =>
  !roles.includes(req.user.role)
    ? res.status(401).json({
        message: "Unauthorized",
        code: 401,
      })
    : next();

const createSuperAdmin = async () => {
  const data = SUPER_ADMIN.split("+");
  const req = {
    firstname: data[0],
    lastname: data[1],
    email: data[2],
    password: data[3],
    role: Roles.SUPER_ADMIN,
  };

  try {
    //Check duplicate email
    const emailExists = await User.findOne({ email: req.email });
    if (emailExists)
      return info({
        message: `Super Admin alredy exists!`,
        badge: true,
      });

    //Create username
    const username = await createUsername(req.firstname, req.lastname);

    //Hash password
    const hashPassword = await createHashPassword(req.password);
    //Create New User
    const user = new User({
      ...req,
      username,
      hash_password: hashPassword,
      active: true,
    });

    await user.save();

    return info({
      message: `Super Admin created!`,
      badge: true,
    });
  } catch (err) {
    return error({
      message: `${err}`,
      badge: true,
    });
  }
};

const createUsername = async (firstname, lastname) => {
  const count = 0;
  const username =
    firstname[0].toLowerCase() + lastname.toLowerCase() + zeroPad(count, 3);
  const usernameExists = await User.findOne({ username: username });
  while (usernameExists) {
    count++;
    username =
      firstname[0].toLowerCase() + lastname.toLowerCase() + zeroPad(count, 3);
    usernameExists = await User.findOne({ username: username });
  }

  return username;
};

const createHashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(password, salt);
  return hashPassword;
};

module.exports = {
  authorization,
  checkRole,
  createSuperAdmin,
  createUsername,
  createHashPassword,
};
