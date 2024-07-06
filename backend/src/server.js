const express = require("express");
const morgan = require("morgan");
const cors = require("cors")
const app = express();

app.use(morgan("common"));
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));

app.get("/", function (req, res, next) {
  return res.json({ message: "ok" })
});


require("./app/routes/tutorial.routes")(app);
require("./app/routes/users.routes")(app);


app.use((req, res, next) => {
  const err = new Error('Not found')
  err.status = 404
  next(err)
})

app.use((err, req, res, next) => {
  const statusCode = err.status || 500
  return res.status(statusCode).json({
      status:'error',
      code: statusCode,
      stack: err.stack,
      message: err.message || 'Internal server error'
  })
})

module.exports = app;
