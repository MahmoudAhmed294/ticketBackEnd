const jwt = require( "jsonwebtoken"),
 config = require( "../config/index.js");


exports.getToken = (user, expirationTime) => {
  const token = jwt.sign(
      { user },
      config.token,
      {
          expiresIn: expirationTime 
      }
  )

  return token
}


exports.withAuth = function(req, res, next) {
  const token = 
      req.body.token ||
      req.query.token ||
      req.headers['x-access-token'] ||
      req.cookies.token;

  if (!token) {
    res.status(401).send('Unauthorized: No token provided');
  } else {
    try {
      const decoded = jwt.verify(token, config.token);


      req.data = decoded.user;
      next();
    } catch (err) {
      return res.status(401).send("Invalid Token");
  }

  }
}


