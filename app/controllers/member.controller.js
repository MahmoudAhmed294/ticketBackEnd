const db = require("../config/db");
const { QueryTypes } = require("sequelize");

exports.getMember = async (req, res) => {
  const { id } = req.params;
  try {
    const memberName = await db.sequelize.query(
      `select Name , ID  from clMembersData where ID = ${+id} `,
      { type: QueryTypes.SELECT, raw: true }
    );
    res.json(memberName[0]);
  } catch (error) {
    console.log(error);
    res.send(error);
  }
};
