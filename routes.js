let express         = require('express'),
    routes          = express.Router();
let userController  = require('./controller/user-controller');
let passport	    = require('passport');




const io = require('../server.js').io;
 routes.post('/message', (req, res) => {
  const data = req.body;
   // Emit the message to all clients
  io.emit('message', data);
   res.send('Message sent');
});






routes.get('/', (req, res) => {
    return res.send('Hello, this is the API!');
});

routes.post('/register', userController.registerUser);
routes.post('/login', userController.loginUser);
routes.post('/auth/logout', userController.logoutUser);
//routes.get('/UsersEmail', passport.authenticate('jwt', {session: false}), (req, res) => {
    //return res.json({ email: req.user.email });
 // });

routes.get('/special', passport.authenticate('jwt', { session: false }), (req, res) => {
    return res.json({ msg: `Hey ${req.user.email}! I open at the close.` });
});

module.exports = routes;


