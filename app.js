// console.log("this will print first");

const express = require('express');
const morgan = require('morgan');
const tourRouter = require('./routes/TourRoutes');
const userRouter = require('./routes/UserRoutes');
const reviewRouter=require('./routes/ReviewRoutes');
const apiError = require('./utils/apiError');
const errorController = require('./controllers/ErrorController');
const rateLimit = require('express-rate-limit');

const helmet=require('helmet');
const mongoSantize=require('express-mongo-sanitize')
const xss=require('xss-clean');
const hpp=require('hpp');
const path=require('path');
const viewRouter=require('./routes/viewRoutes');
const cookieParser=require('cookie-parser');
const bookingRoutes=require('./routes/bookingsRoutes')
const compression=require('compression')

const app = express();

//express
//Express is a minimal and flexible Node.js web application framework that
//provides a set of features to build web and backend applications,
//especially APIs.
// const app = express(); it creates an instance of the express application.


app.set('view engine','pug');
app.set('views',path.join(__dirname,'views'));


// http middlewares
//app.use(helmet());

// MiddleWares
app.use(express.json({limit:'10kb'}));
app.use(cookieParser());

app.use(mongoSantize());
app.use(xss());
app.use(hpp({
  whitelist:['duration','ratingsAverage','difficulty','price']
}))

app.use(morgan('dev'));

app.use(express.static('./public'))

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
})

const limitter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: "reques limit reached ,please try in an hour"
})




// compression is used to compress the response body text message
app.use(compression());
// this is used to limit the number of requests from a single IP address
app.use('/api', limitter);


// this /api will be used for backend api routes and it separates the routes of backend and frontend

// without using this routers we can still do it like app.get("") but this is
// suitable as the size of file grows

// console.log("hello world");
app.use('/',viewRouter);
app.use('/api/v1/tour', tourRouter);
app.use('/api/v1/user', userRouter);
app.use('/api/v1/review',reviewRouter);
app.use('/api/v1/booking',bookingRoutes);

app.all('*', (req, res, next) => {

  const err = new apiError(`cannot find the route ${req.originalUrl} in this app`, 404)
  next(err);
});



app.use(errorController)

module.exports = app; 