const db = require("../config/db");
const { QueryTypes } = require("sequelize");

let currentdate = new Date();
const datetime =
  currentdate.getFullYear() +
  "-" +
  (currentdate.getMonth() + 1) +
  "-" +
  currentdate.getDate() +
  " " +
  currentdate.getHours() +
  ":" +
  currentdate.getMinutes() +
  ":" +
  currentdate.getSeconds();

exports.BillNumberForTicket = async (req, res) => {
  try {
    const ticketNumber = await db.sequelize.query(
      `SELECT Top 1 ID FROM clcpTicketD WHERE ID = (SELECT MAX(ID) FROM clcpTicketD)`,
      { type: QueryTypes.SELECT, raw: true }
    );
    res.json(ticketNumber[0].ID);
  } catch (err) {
    console.log(err);
  }
};

exports.BillNumber = async (req, res) => {
  try {
    const billNumber = await db.sequelize.query(
      `SELECT Top 1 ID FROM clcpTicket WHERE ID = (SELECT MAX(ID) FROM clcpTicket)`,
      { type: QueryTypes.SELECT, raw: true }
    );
    res.json(billNumber[0].ID);
  } catch (err) {
    console.log(err);
  }
};

exports.addBill = async (req, res) => {
  const {
    summary,
    total,
    tax,
    userName,
    MemberID,
    CardID,
    paymentMethod,
    isPrinted,
    BillNumber,
  } = req.body;
  const paymentOption =
    paymentMethod === "Cash"
      ? 1
      : paymentMethod === "Card"
      ? 2
      : paymentMethod === "Visa" && 3;

  try {
    if (CardID) {
      const getCardBalance = await db.sequelize.query(
        `SELECT Top 1 Balance FROM clcpCards  WHERE ID =${CardID}`,
        { type: QueryTypes.SELECT, raw: true }
      );

      if (getCardBalance[0].Balance >= total) {
        await db.sequelize.query(
          `UPDATE dbo.clcpCards SET Balance = ${
            getCardBalance[0].Balance - total
          } WHERE  ID = ${CardID}`,
          { type: QueryTypes.SELECT, raw: true }
        );
      } else {
        res.status(500);
        res.send("no enough balance");
      }
    }
    await db.sequelize.query(
      `INSERT INTO dbo.clcpTicket ( TransactionStamp, PriceCategoryID,
        UserData, MemberID , CardID  , Amount ,Tax , PaymentMethod , isPrinted )
      VALUES ('${datetime}' ,${
        summary[summary.length - 1].ID
      }, '${userName}', ${MemberID}, ${
        CardID ? CardID : null
      } , ${total}, ${tax}, ${paymentOption} ,${isPrinted} )`,
      { type: QueryTypes.SELECT, raw: true }
    );
    res.status(200);
    res.send("done");

    const billnum = BillNumber + 1;

      summary.forEach(
        async (value) =>
          await db.sequelize.query(
            `INSERT INTO clcpTicketD ( TicketID, PriceCategoryID,
            Qty, Price , Tax  , SerialNumber  )
            VALUES (${billnum} , ${value.ID} , ${value.quantity} ,${
              value.Amount
            } ,${value.Tax} ,${Math.floor(1000 + Math.random() * 9000)})`,
            { type: QueryTypes.SELECT, raw: true }
          )
      );
  } catch (error) {
    res.status(500);
    console.log(error.message);
  }
};
