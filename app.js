const path = require('path');
const express = require('express');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');
const compression = require('compression');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerJSDoc = require("swagger-jsdoc");

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const userRouter = require('./routes/userRoutes');
const groupRouter = require('./routes/groupRoutes');
const postRouter = require('./routes/postRoutes');
const userGroupRouter = require('./routes/userGroupRoutes');
const userInfoRouter = require('./routes/userInfoRoutes');
const reportRouter = require('./routes/reportRoutes');

// Start express app
const app = express();

app.enable('trust proxy');

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, './public')));

// 1) GLOBAL MIDDLEWARES
app.use(cors());
app.options('*', cors());

// Set security HTTP headers
app.use(helmet());

// Development logging
if (process.env.ENVIRONMENT === 'dev') {
  app.use(morgan('dev'));
}

// Limit requests from same API
// const limiter = rateLimit({
//   max: 2000,
//   windowMs: 60 * 60 * 1000,
//   message: 'Too many requests from this IP, please try again in an hour!'
// });
// app.use('/api', limiter);

// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// Prevent parameter pollution
// app.use(
//   hpp({
//     whitelist: [
//       'duration',
//       'ratingsQuantity',
//       'ratingsAverage',
//       'maxGroupSize',
//       'difficulty',
//       'price'
//     ]
//   })
// );

app.use(compression());

// 3) ROUTES
app.get('/api/health-check', (req, res, next) => {
  res.status(200).json({
    status: 'success'
  });
});

app.use('/api/v1/users', userRouter);
app.use('/api/v1/groups', groupRouter);
app.use('/api/v1/posts', postRouter);
app.use('/api/v1/userGroups', userGroupRouter);
app.use('/api/v1/userInfos', userInfoRouter);
app.use('/api/v1/reports', reportRouter);

const options = {
  explorer: true,
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'API with Swagger',
      version: '1.0.0.',
    },
  },
  apis: ['./routes/*.js']
};

const swaggerSpec = swaggerJSDoc(options);

app.use('/api/v1', swaggerUi.serve, swaggerUi.setup(swaggerJSDoc(options)));

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
