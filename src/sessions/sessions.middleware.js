

const jwt = require('jsonwebtoken');
const Sessions = require('./sessions.model');

const authenticateSession = async (req, res, next) => {
    try {
      const token = req.header('Authorization').replace('Bearer ', '');
      const decoded = jwt.verify(token, 'keyJwt');
  
      const session = await Sessions.findOne({
        credential: decoded.userId,
        token,
        status: 'active',
      });
      if (!session) {
        throw new Error('Session non trouver');
      }
      const now = new Date();
      const expirationDate = new Date(session.date);
      if (now > expirationDate) {
        throw new Error('Session expiré');
      }
      req.session = session; 
      next();
    } catch (error) {
      res.status(401).send({ error: error.message });
    }
  };
  
  module.exports = authenticateSession;
