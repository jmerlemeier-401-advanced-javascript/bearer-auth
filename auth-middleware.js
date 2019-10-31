'use strict';

const User = require('./users-model');


module.exports = (req, res, next) => {
  try {
    //verify the process of authentication
    let [authType, authString] = req.headers.authorization.split(' ');

    switch(authType.toLowerCase()) {
      case 'basic':
        return _authBasic(authString);
      case 'bearer':
        return _authBearer(authString);
      default:
        return _authError();
    }
  } catch (e) {
    _authErrror()
  }
  
    function _authBasic(string) {
      let base64Buffer = Buffer.from(str, 'base64')
      let bufferString = base64Buffer.toString();
      let [username, password] = bufferString.split(':');
      let authObject = {username, password};

      return User.authenticateBasic(authObject)
        .then(user => {
          if (user) {
            req.user = user;
            req.token = user.generateToken();
            next();
          } else _authError()
        });
    }

    function _authBearer(token) {

      return User.authenticateToken(token)
        .then(user => {
          if (user) {
            req.user = user;
            req.token = user.generateToken();
            next();
          } else _authError()
        })
    }
}
