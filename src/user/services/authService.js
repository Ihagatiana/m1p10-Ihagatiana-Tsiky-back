const jwtService = require("jsonwebtoken");
const token_secret = "dvf025vx4d2vs5vs2vqe1bf2ds5gbsfd6sf52sd2fxb5sdgb8gf5dh5z5rdf6hbdfb9d8gbrs74b1fg";
const bcrypt = require("bcrypt");
const User = require('../models/userModel');

const encryptPassword = (password) => {
    return new Promise((resolve, reject) => {
        bcrypt.hash(password, 10).then((hash) => {
            resolve(hash);
        }).catch((error) => { reject(error) });
    })
}

const comparePasswordencrypted = (inputPassword, databasePassword) => {
    return new Promise((resolve, reject) => {
        bcrypt.compare(inputPassword, databasePassword).then((valid) => {
            if (!valid) {
                resolve(true);
            }
            resolve(false);
        }).catch((error) => {
            reject(`Error on compare Password ${error}`);
        });
    })
}

const saveUser = async (userBody) => {
    try {
        const userModel = new User();
        userModel.name = userBody.name;
        userModel.email = userBody.email;
        userModel.password = await encryptPassword(userBody.password);
        userModel.role = userBody.role;
        return new Promise((resolve, reject) => {
            userModel.save((err) => {
                if (err) {
                    reject(`cant post user :  ${err.message}`);
                }
                resolve(userModel);
            })
        })
    } catch (error) {
        throw ` Error : ${error}`;
    }
}

const checkPasswordUser = async (user) => {
    try {
        const userBase = await User.findOne({ email: user.email}).exec();
        if (!userBase) {
            throw new Error('User not found');
        }
        const resultCheck = await comparePasswordencrypted(userPasswordEncrypted, userBase.password);
        console.log(userBase);
        if (resultCheck) {
            const res = {
                email: userBase.email,
                name: userBase.name,
                role: userBase.role,
                token: jwtService.generateToken(userBase._id),
            };
            return res;
        } else {
            throw new Error('Mot de passe incorrect');
        }
    } catch (error) {
        throw new Error(`Erreur : ${error}`);
    }
};

const authentification = (req, res, next) => {
    try {
      let userId = -1;
      const token = req.headers.authorization.split(" ")[1];
      const decodedToken = jwt.verify(token, token_secret);
      if (decodedToken != null) {
        userId = decodedToken.userId;
      }
      if (userId < 0) {
        throw "Invalid user ID";
      } else {
        res.userId = userId ;
        next();
      }
    } catch {
      res.status(401).json({
        error: "You should first log in!",
      });
    }
  };

const generateToken = (userData) => {
  return jwt.sign({ userId: userData }, token_secret, { expiresIn: "2h" });
};

const token = token_secret;

module.exports = { saveUser, checkPasswordUser, generateToken , authentification , token };