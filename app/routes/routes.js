module.exports = (app) => {
  const { Login, getGateName } = require("../controllers/login.controller.js"),
    { getCard, chargeBalance } = require("../controllers/card.controller.js"),
    {
      BillNumber,
      BillNumberForTicket,
      addBill,
    } = require("../controllers/bill.controller.js"),
    router = require("express").Router();

  router.post("/Login", Login);
  router.get("/gates/:id", getGateName);
  router.get("/cards/:id", getCard);
  router.get("/billNumber", BillNumber);
  router.get("/ticketsNumber", BillNumberForTicket);
  router.post("/bill", addBill);
  router.post("/chargeBalance", chargeBalance);
  app.use("/api", router);
};
