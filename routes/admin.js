const { Router } = require("express");
const router = Router();
const User = require("../models/User");
const Roles = require("../models/Roles");
const { authorization, checkRole } = require("../utils/auth");
const { error, success } = require("consola");
const { RegisterValidation } = require("../utils/validation");
const { TOKEN_SECRET, MAIN_APP_URL } = require("../config");

// Get all admins
router.get(
  "/",
  authorization,
  checkRole(Roles.SUPER_ADMIN),
  async (req, res) => {
    try {
      const admins = await User.find(
        { role: Roles.ADMIN },
        "-hash_password -__v"
      );
      res.send(admins);
    } catch (error) {
      error({ message: err, badge: true });
      res.status(500).send({
        message:
          "Unable to process request. Contact Administrator for support.",
        code: 500,
        error: err,
      });
    }
  }
);

// Create a new admin
router.post(
  "/",
  authorization,
  checkRole(Roles.SUPER_ADMIN),
  async (req, res) => {
    try {
      req.body.password = "";
      req.body.secret = TOKEN_SECRET;
      const { error } = RegisterValidation(req.body);
      if (error)
        return res.status(400).json({
          message: error.details[0].message,
          code: 400,
        });

      //Roles must be Roles.ADMIN
      const canRegister = req.body.role === Roles.ADMIN;
      if (!canRegister) {
        return res.status(403).json({
          message: "Unable to complete registeration. User Role must be Admin.",
          code: 403,
        });
      }

      //Check duplicate email
      const emailExists = await User.findOne({ email: req.body.email });
      if (emailExists)
        return res.status(400).json({
          message: "Email already exists",
          code: 400,
        });

      //Create username
      const count = 0;
      const username =
        req.body.firstname[0].toLowerCase() +
        req.body.lastname.toLowerCase() +
        zeroPad(count, 3);
      const usernameExists = await User.findOne({ username: username });
      while (usernameExists) {
        count++;
        username =
          req.body.firstname[0].toLowerCase() +
          req.body.lastname.toLowerCase() +
          zeroPad(count, 3);
        usernameExists = await User.findOne({ username: username });
      }

      //Hash password
      const salt = await bcrypt.genSalt(10);
      const hashPassword = await bcrypt.hash(req.body.secret, salt);

      //Create New User
      const newUser = new User({
        ...req.body,
        username,
        hash_password: hashPassword,
        isApproved: true,
      });
      await newUser.save();
      const linkSecret = TOKEN_SECRET + newUser.hash_password;
      const payload = { email: newUser.email, user_id: newUser._id };
      const token = jwt.sign(payload, linkSecret, { expiresIn: "48h" });
      const link = `${MAIN_APP_URL}/resetpassword/${user._id}/${token}`;
      info({ message: link });

      return res.status(201).send({
        message: "Admin User invited!",
        code: 201,
      });
    } catch (error) {
      res.status(500).send(error.message);
    }
  }
);

// Get admin By ID
router.get(
  "/:id",
  authorization,
  checkRole(Roles.SUPER_ADMIN),
  async (req, res) => {
    try {
      const admin = await User.findById(req.params.id, "-hash_password -__v");
      res.send(admin);
    } catch (error) {
      res.status(500).send(error.message);
    }
  }
);

// Update admin By ID
router.put(
  "/:id",
  authorization,
  checkRole(Roles.SUPER_ADMIN),
  async (req, res) => {
    try {
      const admin = await User.findByIdAndUpdate(
        req.params.id,
        {
          ...req.body,
        },
        { new: true }
      );
      return res.send({
        message: "Admin User Updated",
        code: 200,
      });
    } catch (error) {
      res.status(500).send(error.message);
    }
  }
);

// Delete admin By ID
router.delete(
  "/:id",
  authorization,
  checkRole(Roles.SUPER_ADMIN),
  async (req, res) => {
    try {
      const admin = await User.findByIdAndDelete(req.params.id);
      res.send(admin);
    } catch (error) {
      res.status(500).send(error.message);
    }
  }
);

module.exports = router;
