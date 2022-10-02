const jwt = require("jsonwebtoken"),
  config = require("../config/index.js");

exports.getToken = (user, expirationTime) => {
  const token = jwt.sign({ user }, config.token, {
    expiresIn: expirationTime,
  });

  return token;
};

exports.withAuth = function (req, res, next) {
  try {
    const token =  req.headers['authorization']|| req.headers.cookie ;
    if (!token) {
      res.status(400).send("Unauthorized: No token provided");
    } else {
      try {
        const decoded = jwt.verify(token, config.token);

        req.data = decoded.user;
        next();
      } catch (err) {
        return res.status(401).send("Invalid Token");
      }
    }
  } catch (err) {
    console.log(err);
    res.status(500);
  }
};
