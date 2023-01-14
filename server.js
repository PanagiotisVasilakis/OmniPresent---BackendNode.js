var express     = require('express');
var bodyParser  = require('body-parser');
var passport	= require('passport');
var mongoose    = require('mongoose');
var config      = require('./config/config');
var url        = process.env.MONGODB_URL;
var cors        = require('cors');
var app = express();
app.use(cors());
var port = process.env.PORT || 5000;

// get our request parameters
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Use the passport package in our application
app.use(passport.initialize());
var passportMiddleware = require('./middleware/passport');
passport.use(passportMiddleware);

// Demo Route (GET http://localhost:5000)
mongoose.set('strictQuery', true);
app.get('/', function(req, res) {
  return res.send('Hello! The API is at http://localhost:' + port + '/api');
});

var routes = require('./routes');
app.use('/api', routes);

mongoose.connect("mongodb+srv://server:server@cluster0.clbzhwb.mongodb.net/?retryWrites=true&w=majority"/*,config.db { useNewUrlParser: true , useCreateIndex: true}*/);

const connection = mongoose.connection;

connection.once('open', () => {
    console.log('MongoDB database connection established successfully!');
});

connection.on('error', (err) => {
    console.log("MongoDB connection error. Please make sure MongoDB is running. " + err);
    process.exit();
});

// Start the server
app.listen(port);
console.log('There will be dragons: http://localhost:' + port);