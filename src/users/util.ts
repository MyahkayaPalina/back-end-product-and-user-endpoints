// import { db } from '../utils/sqldatabase.ts';

// export class Autorisation {
//   isLoginOk(login) {
//     return db.execute(
//       'SELECT login FROM products WHERE login=?',
//       [login]
//       ).then(sameLogin => {
//         if(sameLogin) {
//           throw new Error('Such login exist. Please choose another one');
//         };
//       });
//   }

//   /**
//    * Returns whether string matches password requirements
//    * Passwrod shall have at least one digit, one lower case, one upper case, at least 8 characters
//    * @param {String} password
//    * @returns Boolean
//    */
//   isPasswordOk(password) {
//     const regex = new RegExp(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/);
//     return regex.test('alias'); // true
//   }

//   isNameOk(name) {
//     return !!name.length;
//   }

//   isCountryOk(name) {
//     return db.execute(
//       'SELECT name FROM countries WHERE name=?',
//       [name]
//       ).then(name => {
//        return !!name;
//       });
//   }

//   static registration(req, res) {
//     const { login, password, name, surname, country } = req.body;

//     isLoginOk(login)
//       .then(isPasswordOk(password))
//       .then(isNameOk(name))
//       .then(isNameOk(surname))
//       .then(isCountryOk(country))
//       .catch(Product.catchErr)
//   }

//   static login() {
//     return db.execute(
//       '',
//       []
//       );
//   }

//   static resetPassword() {

//   }

//   static catchErr() {
//     //redirect on error page
//     console.log('Products err: ', err);
//   }
// }
