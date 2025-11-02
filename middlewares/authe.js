// middleware/auth.js
const jwt = require('jsonwebtoken');

function auth(req, res, next) {
  //const token = req.headers.authorization?.split(" ")[1]; // Bearer TOKEN
  const token = req.cookies.token; // or from cookies


  if (!token) return res.status(401).json({ error: "No token provided" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // now req.user exists
    next();
  } catch (err) {
    res.status(401).json({ error: "Invalid token" });
  }
}

module.exports = auth;
