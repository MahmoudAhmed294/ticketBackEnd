const db = require("../config/db");
const { QueryTypes } = require("sequelize");

const dayName = new Date().toLocaleString("en-US", { weekday: "long" });

exports.TicketHandleForUser = async (ids) => {
  try {
    const allTicket = await db.sequelize.query(
      `select * from clcpPriceCategories where ${dayName} = 1 and IsActive = 1 and ID  in(${ids
        .map(({ PriceCategory }) => PriceCategory)
        .join()
        .split(",")
        .map((i) => i)
        .join()})`,
      { type: QueryTypes.SELECT, raw: true }
    );
    return allTicket;
  } catch (error) {
    console.log(error);
    return undefined;
  }
};
