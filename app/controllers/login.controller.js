const axios = require("axios"),
  db = require("../config/db"),
  { TicketHandleForUser } = require("./ticket.controller.js"),
  { QueryTypes } = require("sequelize"),
  { getToken } = require("../middleware/auth"),
  maxAge = 168 * 60 * 60;

exports.Login = async (req, res) => {
  const user = await axios
    .post(
      "https://open-air-mall-proxy-server.vercel.app/api/FrontEnd/SignIn",
      req.body
    )
    .then((res) => {
      return res.data.name;
    })
    .catch((error) => {
      console.error(error);
    });
  if (user !== "Invlid user") {
    const GateID = await db.sequelize.query(
      `select GateID from clcpGateUsers where UsersName = '${user}'`,
      { type: QueryTypes.SELECT, raw: true }
    );
    const PriceCategoryIds = await db.sequelize.query(
      `select PriceCategory from clcpPriceCategoryGates where Gate = ${GateID[0].GateID}`,
      { type: QueryTypes.SELECT, raw: true }
    );

    const allTickets = await TicketHandleForUser(PriceCategoryIds);

    if (allTickets) {
      const token = getToken(
        {
          GateID: GateID[0].GateID,
          userName: user,
        },
        maxAge
      );
      res.cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "None",
        maxAge: maxAge * 1000,
      });
      res
        .json({
          userName: user,
          tickets: allTickets,
          GateID: GateID[0].GateID,
        })
        .status(200);
    }
  } else {
    res.send("Invalid user");
    res.status(500);
  }
};

exports.sendTicketsIfLogin = async (GateID) => {
  const PriceCategoryIds = await db.sequelize.query(
    `select PriceCategory from clcpPriceCategoryGates where Gate = ${GateID}`,
    { type: QueryTypes.SELECT, raw: true }
  );

  const allTickets = await TicketHandleForUser(PriceCategoryIds);

  return allTickets;
};

exports.getGateName = async (req, res) => {
  const { id } = req.params;
  try {
    const GateName = await db.sequelize.query(
      `select Name from clcpGates where ID = ${+id}`,
      { type: QueryTypes.SELECT, raw: true }
    );

    res.json({Name:GateName[0].Name});
  } catch (error) {
    console.log(error);
    res.send(error);
  }
};
