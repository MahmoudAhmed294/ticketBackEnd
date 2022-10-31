const db = require("../config/db");
const { QueryTypes } = require("sequelize");

let currentdate = new Date();
const date =
  currentdate.getFullYear() +
  "-" +
  (currentdate.getMonth() + 1) +
  "-" +
  currentdate.getDate();

exports.getCard = async (req, res) => {
  const { id } = req.params;
  try {
    const cardInfo = await db.sequelize.query(
      `select * from clcpCards where CardCode = '${id}' and IsActive = 1 and IsBlocked = 0  `,
      { type: QueryTypes.SELECT, raw: true }
    );
    const member = await db.sequelize.query(
      `select Name , ID  from clMembersData where ID = ${+cardInfo[0]
        .MemberID} `,
      { type: QueryTypes.SELECT, raw: true }
    );

    res.json({
      member: { ID: member[0].ID, Name: member[0].Name },
      card: {
        ID: cardInfo[0].ID,
        Balance: cardInfo[0].Balance,
        IsPrinted: cardInfo[0].IsPrinted,
        MemberID: cardInfo[0].MemberID,
      },
    });
  } catch (error) {
    console.log(error);
    res.send(error);
  }
};

exports.chargeBalance = async (req, res) => {
  try {
    const { ID, balance, userName } = req.body;

    if (balance > 0) {
      return new Promise(async (resolve, reject) => {
        const card = await db.sequelize.query(
          `select * from clcpCards  WHERE ID = ${ID}`,
          { type: QueryTypes.SELECT, raw: true }
        );
         await db.sequelize.query(
          `INSERT INTO clcpCardTopUp  (
            CardID,
            Amount,
            ChargeDate,
            ChargeUser,
            IsPaid
      
          ) VALUES (${card[0].ID} , ${balance} , '${date}' , '${userName}' , 1 )`,
          { type: QueryTypes.SELECT, raw: true }
        );
        res.json({
          ID: card[0].ID,
        });
        res.status(200);
      })
    } else {
      res.send('unexpected error happened'); 
           res.status(500);
    }
  } catch (err) {
    console.log(err);
    res.status(500);
  }
};
