const express = require("express");
const app = express();
const cors = require("cors");
const { connect } = require("mongoose");
const { success, error } = require("consola");
const passport = require("passport");
const audit = require('express-requests-logger');
const { MONGO_DB_URL } = require("./config");
const { createSuperAdmin, authorization } = require("./utils/auth");

// Middleware Connections
app.use(cors());
app.use(express.json());
app.use(passport.initialize());
require("./middlewares/Authorization")(passport);

//Routes
app.get('/', (req, res) => {
  res.send({
    name: "Vishma API Service",
    version: "v1.0.0",
    dateTime: new Date()
  })
}); 
app.use("/api/v1/auth", require("./routes/auth"));
app.use("/api/v1/dashboard", require("./routes/dashboard"));
app.use("/api/v1/posts", require("./routes/post"));
app.use("/api/v1/admin", require("./routes/admin"));
app.use("/api/v1/user", require("./routes/user"));

app.get('*', authorization, (req, res) => {
  res.send({
    name: "Vishma API Service",
    version: "v1.0.0",
    dateTime: new Date()
  })
}); 


const startApp = async () => {
  try {
    // Connection With DB
    await connect(MONGO_DB_URL, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    });

    success({
      message: `Successfully connected with the Database \n${MONGO_DB_URL}`,
      badge: true,
    });

    createSuperAdmin();

    
    // Start Listenting for the server on PORT
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () =>
      success({ message: `Server started on PORT ${PORT}`, badge: true })
    );

  } catch (err) {
    error({
      message: `Unable to connect with Database \n${err}`,
      badge: true,
    });
    startApp();
  }
};



startApp();


