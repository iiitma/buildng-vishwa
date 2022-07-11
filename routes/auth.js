const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { error, info } = require("console");
const {
  RegisterValidation,
  LoginValidation,
  ResetLinkValidation,
} = require("../utils/validation");
const Roles = require("../models/Roles");
const { TOKEN_SECRET, MAIN_APP_URL } = require("../config");
const User = require("../models/User");
const { zeroPad } = require("../utils/misc");

// register
router.post("/register", async (req, res) => {
  try {
    // Validate request
    const { error } = RegisterValidation(req.body);
    if (error)
      return res.status(400).json({
        message: error.details[0].message,
        code: 400,
      });

    //Roles must be Roles.USER or Roles.STUDENT
    const canRegister = Roles.SUB_ADMIN_LEVEL.includes(req.body.role);
    if (!canRegister) {
      return res.status(403).json({
        message: "Unable to complete registeration. Contact Administrator for support.",
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
      req.body.firstname[0].toLowerCase() + req.body.lastname.toLowerCase() + zeroPad(count, 3);
    const usernameExists = await User.findOne({ username: username });
    while (usernameExists) {
      count++;
      username = req.body.firstname[0].toLowerCase() + req.body.lastname.toLowerCase() + zeroPad(count, 3);
      usernameExists = await User.findOne({ username: username });
    }

    //Hash password
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(req.body.password, salt);

    //Create New User
    const newUser = new User({
      ...req.body,
      username,
      hash_password: hashPassword,
      isApproved: req.body.role === Roles.STUDENT,
    });
    await newUser.save();
    return res.status(201).send({
      message: "User created succesfully",
      code: 201,
    });
  } catch (err) {
    error({ message: err, badge: true });
    res.status(500).send({
      message: "Unable to process request. Contact Administrator for support.",
      code: 500,
      error: error,
    });
  }
});

// login
router.post("/token", async (req, res) => {
  // Validate request
  const { error } = LoginValidation(req.body);
  if (error) {
    return res.status(400).json({
      message: error.details[0].message,
      code: 400,
    });
  }

  //Check email exist
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return res.status(404).json({
      message: "User account doesn't exist",
      code: 404,
    });
  }

  //Check password
  const validPassword = await bcrypt.compare(
    req.body.password,
    user.hash_password
  );
  if (!validPassword)
    return res.status(401).json({
      message: "Invalid Password",
      code: 401,
    });

  //Check Blocked Account
  if (user.isBlocked) {
    return res.status(401).json({
      message: "Account Blocked! Contact Administrator for support.",
      code: 401,
    });
  }

  const token = jwt.sign(
    {
      user_id: user._id,
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      role: user.role,
    },
    process.env.TOKEN_SECRET,
    { expiresIn: "24h" }
  );
  const loggedInUser = {
    firstname: user.firstname,
    lastname: user.lastname,
    username: user.username,
    email: user.email,
    role: user.role,
    active: user.active,
    isBlocked: user.isBlocked,
    token: token,
    expiresIn: 24,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
  res.header("Authorization", token).send(loggedInUser);
});

// Send reset link
router.post("/resetlink", async (req, res) => {
  try {
    // Validate request
    const { error } = ResetLinkValidation(req.body);
    if (error)
      return res.status(400).json({
        message: error.details[0].message,
        code: 400,
      });

    //Check duplicate email
    const user = await User.findOne({ email: req.body.email });
    if (!user)
      return res.status(400).json({
        message: "Invalid Request! No user found",
        code: 400,
      });

    const linkSecret = TOKEN_SECRET + user.hash_password;
    const payload = { email: user.email, user_id: user._id };
    const token = jwt.sign(payload, linkSecret, { expiresIn: "15m" });
    const link = `${MAIN_APP_URL}/resetpassword/${user._id}/${token}`;
    info({ message: link });
    return res.send({
      message: "Password Reset link has been sent",
      code: 200,
    });
  } catch (err) {
    error({ message: err, badge: true });
    res.status(500).send({
      message: "Unable to process request. Contact Administrator for support.",
      code: 500,
      error: err,
    });
  }
});

router.post("/resetpassword", async (req, res) => {
  try {
    const linkSecret = TOKEN_SECRET + user.hash_password;
    const payload = jwt.verify(req.body.token, linkSecret);

    if (req.body.id !== payload.user_id) {
      return res.status(400).json({
        message: "Invalid Token",
        code: 400,
      });
    }

    if (req.body.password !== req.body.confirmPassword) {
      return res.status(400).json({
        message: "Invalid Request! Password must match",
        code: 400,
      });
    }

    //Hash password
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(req.body.password, salt);

    const user = await User.findByIdAndUpdate(
      req.body.id,
      {
        hashPassword
      },
      { new: true }
    )
    if(!user) {
      return res.status(400).json({
        message: "Unable to complete this request.",
        code: 400,
      });
    } 
    return res.send({
      message: "Password Reset successfully!"
    });
  } catch (error) {
    error({ message: err, badge: true });
    res.status(500).send({
      message: "Unable to process request. Contact Administrator for support.",
      code: 500,
      error: err,
    });
  }
});

module.exports = router;
