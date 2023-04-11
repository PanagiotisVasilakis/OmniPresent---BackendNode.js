let express     = require('express');
let bodyParser  = require('body-parser');
let passport	= require('passport');
let mongoose    = require('mongoose');
let config      = require('./config/config');

let cors        = require('cors');
let app = express();
app.use(cors());
let port = process.env.PORT || 4000;
const request = require('request');







const socketIo = require('socket.io');
const io = socketIo(server);

io.on('connection', (socket) => {
  console.log('Client connected');
   // Handle messages sent from the client
  socket.on('message', (data) => {
    console.log(`Message received: ${JSON.stringify(data)}`);
     // Emit the message to all clients except the sender
    socket.broadcast.emit('message', data);
  });
   // Handle disconnections
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});







// get our request parameters
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Use the passport package in our application
app.use(passport.initialize());
let passportMiddleware = require('./middleware/passport');
passport.use(passportMiddleware);

// Demo Route (GET http://192.168.56.1:4000)
app.get('/', function(req, res) {
    return res.send('Hello! The API is at http://192.168.56.1:' + port + '/api');
  });

  app.use('/maps-api', (req, res) => {
    const url = `https://maps.googleapis.com${req.url}`;
    req.pipe(request(url)).pipe(res);
  });
  

let routes = require('./routes');
app.use('/', routes);

mongoose.set("strictQuery", false);
mongoose.connect(config.db, { useNewUrlParser: true });

const connection = mongoose.connection;

connection.once('open', () => {
    console.log('MongoDB database connection established successfully!');
});

connection.on('error', (err) => {
    console.log("MongoDB connection error. Please make sure MongoDB is running. " + err);
    process.exit();
});

// Start the server
app.listen(port, '192.168.56.1');
console.log('Perfection exist in: http://192.168.56.1:' + port);