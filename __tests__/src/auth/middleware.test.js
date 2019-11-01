'use strict';

require('dotenv').config();

const supergoose = require('../../supergoose.js');
const auth = require('../../../src/auth/middleware.js');
const Users = require('../../../src/auth/users-model.js');
const jwt = require('jsonwebtoken');

let users = {
  admin: {username: 'admin', password: 'password', role: 'admin'},
  editor: {username: 'editor', password: 'password', role: 'editor'},
  user: {username: 'user', password: 'password', role: 'user'},
};

beforeAll(async (done) => {
  await supergoose.startDB();
  const adminUser = await new Users(users.admin).save();
  const editorUser = await new Users(users.editor).save();
  const userUser = await new Users(users.user).save();
  done();
});

afterAll(supergoose.stopDB);

describe('Auth Middleware', () => {
  
  // admin:password: YWRtaW46cGFzc3dvcmQ=
  // admin:foo: YWRtaW46Zm9v
  
  let errorObject = 'Invalid User ID/Password';
  
  describe('user authentication', () => {
    
    let cachedToken;

    it('fails a login for a user (admin) with the incorrect basic credentials', () => {

      let req = {
        headers: {
          authorization: 'Basic YWRtaW46Zm9v',
        },
      };
      let res = {};
      let next = jest.fn();
      let middleware = auth();

      return middleware(req, res, next)
        .then(() => {
          expect(next).toHaveBeenCalledWith(errorObject);
        });

    }); // it()

    it('logs in an admin user with the right credentials', () => {

      let req = {
        headers: {
          authorization: 'Basic YWRtaW46cGFzc3dvcmQ=',
        },
      };
      let res = {};
      let next = jest.fn();
      let middleware = auth();

      return middleware(req,res,next)
        .then(() => {
          cachedToken = req.token;
          expect(next).toHaveBeenCalledWith();
        });

    }); 

    xit('accepts a valid token', async (done) => {
      let testUser = await new Users({password: 'test', username: 'test', role: 'user'})
        .save();
      let token = jwt.sign({id: testUser._id, role: testUser.role}, process.env.SECRET || 'secret');

      let req = {
        headers: {
          authorization: `bearer ${token}`,
        },
      };
      let res = {};
      let next = jest.fn();
      let middleware = auth();

      return middleware(req, res, next)
        .then(() => {
          expect(next).toHaveBeenCalledWith();
          done();
        });
    }); 
    
    it('fails to get a token for the user', async (done) => {
      let testUser2 = await new Users({password: 'test2', username: 'test2', role: 'user'}).save();
      let token = jwt.sign({id: testUser2._id, role: testUser2.role}, 'wrong');

      let req = {
        headers: {
          authorization: `bearer ${token}`,
        },
      };
      let res = {};
      let next = jest.fn();
      let middleware = auth();

      middleware(req, res, next);
      expect(next).toHaveBeenCalledWith(errorObject);
      done();
    });
  });
});