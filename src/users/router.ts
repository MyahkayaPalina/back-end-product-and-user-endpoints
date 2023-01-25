// import express from 'express';
// import { Autorisation } from './util';

// const autorisationRouter = express.Router();

// autorisationRouter.use((req, res, next) => {
//     console.log('Обработчик для авторизации');
//     next();
//   }
// );

//todo shall be get? or post?
// autorisationRouter.get('/registration', (req, res, next) =>
//   Autorisation.registration(req, res)
// );

// todo shall be get? or post?
//autorisationRouter.get('/login', (req, res, next) => {
// Autorisation.login(req.body)
//   .then(() => {
//     res.redirect('/');
//   })
//   .catch(Autorisation.catchErr);
//});

//ToDo shall be add for login and for password
// autorisationRouter.use((err, req, res, next) => {
//   console.log(err.message);
//   res.status(500).send(err.message);
// })

//export { autorisationRouter };
