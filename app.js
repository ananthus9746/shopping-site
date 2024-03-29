// var createError = require("http-errors");
// var express = require("express");
// var path = require("path");
// var cookieParser = require("cookie-parser");
// var logger = require("morgan");
// const bodyParser = require("body-parser");
// const dotenv = require("dotenv");
// const hbs = require("express-handlebars");
// const mongoose = require("mongoose");
// var session = require("express-session");

// //
// const {
//   allowInsecurePrototypeAccess,
// } = require("@handlebars/allow-prototype-access");
// const Handlebars = require("handlebars");
// //

// //enviorment variable/constants
// dotenv.config();

// var userRouter = require("./routes/user");
// var adminRouter = require("./routes/admin");
// var app = express();

// // view engine setup
// app.set("views", path.join(__dirname, "views"));
// app.set("view engine", "hbs");
// app.engine(
//   "hbs",
//   hbs.engine({
//     handlebars: allowInsecurePrototypeAccess(Handlebars),
//     extname: "hbs",
//     defaultLayout: "layout",
//     layoutsDir: __dirname + "/views/layout/",
//     partialsDir: __dirname + "/views/partials",
//   })
// );

// //SESSION
// app.use(session({ secret: "key", cookie: { maxAge: 1200000 } }));

// app.use(logger("dev"));
// app.use(express.json());
// app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser());

// app.use(express.static(path.join(__dirname, "public")));

// //Database connection//config//
// mongoose
//   .connect(
//     `mongodb+srv://${process.env.MONGO_DB_USER}:${process.env.MONGO_DB_PASSWORD}@cluster0.doqvtqs.mongodb.net/${process.env.MONGO_DB_DATABASE}?retryWrites=true&w=majority`,
//     {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     }
//   )
//   .then(() => {
//     console.log("Database connected");
//   });
// app.use(function (req, res, next) {
//   res.header(
//     "Cache-Control",
//     "no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0"
//   );
//   next();
// });
// app.use("/", userRouter);
// app.use("/admin", adminRouter);

// // catch 404 and forward to error handler
// app.use(function (req, res, next) {
//   next(createError(404));
// });

// // error handler
// app.use(function (err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get("env") === "development" ? err : {};

//   // render the error page
//   res.status(err.status || 500);
//   res.render("error");
// });

// module.exports = app;
var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const hbs = require("express-handlebars");
const mongoose = require("mongoose");
var session = require("express-session");

const {
  allowInsecurePrototypeAccess,
} = require("@handlebars/allow-prototype-access");
const Handlebars = require("handlebars");

dotenv.config();

var userRouter = require("./routes/user");
var adminRouter = require("./routes/admin");
var app = express();

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");
app.engine(
  "hbs",
  hbs.engine({
    handlebars: allowInsecurePrototypeAccess(Handlebars),
    extname: "hbs",
    defaultLayout: "layout",
    layoutsDir: __dirname + "/views/layout/",
    partialsDir: __dirname + "/views/partials",
  })
);

app.use(session({ secret: "key", cookie: { maxAge: 1200000 } }));

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, "public")));

mongoose
  .connect(
    `mongodb+srv://${process.env.MONGO_DB_USER}:${process.env.MONGO_DB_PASSWORD}@cluster0.doqvtqs.mongodb.net/${process.env.MONGO_DB_DATABASE}?retryWrites=true&w=majority`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => {
    console.log("Database connected");
  });

app.use(function (req, res, next) {
  res.header(
    "Cache-Control",
    "no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0"
  );
  next();
});

app.use("/", userRouter);
app.use("/admin", adminRouter);

app.use(function (req, res, next) {
  next(createError(404));
});

app.use(function (err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  res.status(err.status || 500);
  res.render("error");
});

const port = 3000;

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

module.exports = app;
