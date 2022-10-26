const axios = require("axios"),
  db = require("../config/db"),
  { TicketHandleForUser } = require("./ticket.controller.js"),
  { QueryTypes } = require("sequelize"),
  { getToken } = require("../middleware/auth"),
  maxAge = 168 * 60 * 60;

exports.Login = async (req, res) => {
  try{

    const user = await db.sequelize.query(
      `
      SELECT userName 
      FROM [dbo].[AspNetUsers] 
      where Id = (
        SELECT Id 
        FROM [dbo].[tktUsers] 
        where UserName = '${req.body.userName}' And PasswordHash = '${req.body.password}'
        )
        `,
        { type: QueryTypes.SELECT, raw: true }
        );
        if (user) {
          const GateID = await db.sequelize.query(
            `select GateID from clcpGateUsers where UsersName = '${user[0].userName}'`,
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
          userName: user[0].userName,
          isAdmin: user[0].userName === "Admin" && true,
        },
        maxAge
        );
        
        res
        .json({
          token: token,
          userName: user[0].userName,
          tickets: allTickets,
          GateID: GateID[0].GateID,
          isAdmin: user[0].userName === "Admin" && true,
        })
        .status(200);
      }
    } 
  }
  catch(error){
    res.status(500);
    res.send(error)


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

    res.json({ Name: GateName[0].Name });
  } catch (error) {
    // console.log(error);
    res.send(error);
  }
};
