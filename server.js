const express = require("express"),
  cors = require("cors"),
  helmet = require("helmet"),
  morgan = require("morgan"),
  compression = require("compression"),
  db = require("./app/config/db"),
  config = require("./app/config"),
  app = express(),
  { sendTicketsIfLogin } = require("./app/controllers/login.controller"),
  { withAuth } = require("./app/middleware/auth.js");

corsOptions = {
  origin: config.FRONT_HOST,
  credentials: true,
  optionSuccessStatus: 200,
};

app
  .use(cors(corsOptions))
  .use(morgan("combined"))
  .use(helmet())
  .use(compression())
  .use(express.json())
  .use(express.urlencoded({ extended: true }));

app.get("/api/checkToken", withAuth, async (req, res) => {
  const Tickets = await sendTicketsIfLogin(req.data.GateID);
  if (Tickets.length !== 0) {
    res
      .json({
        userName: req.data.userName,
        GateID: req.data.GateID,
        tickets: Tickets,
      })
      .status(200);
  }
});


db.sequelize.sync();
app.get("/", (req, res) => {
  res.json({ message: "Welcome to bezkoder application." });
});

require("./app/routes/routes")(app);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
