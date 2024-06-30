const express = require("express");
const morgan = require("morgan");
const cors = require("cors")
const { redisInstance } = require("./app/redis/redis");
// Api
const app = express();

app.use(morgan("common"));
app.use(express.json());
app.use(cors());
// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

app.get("/", function (req, res, next) {
  return res.json({ message: "ok" })
});

app.get("/home", (req, res) => {
  res.render("home");
});

app.post("/redis/set", async (req, res) => {
  const { key, value } = req.body;
  try {
    await redisInstance.setKeyValue(key, value, {
      EX: 10,
      NX: true
    });
    res.json({ message: `Key ${key} set with value ${value}` });
  } catch (err) {
    console.error('Error setting value in Redis:', err);
    res.status(500).json({ error: 'Error setting value in Redis' });
  }
});

app.get("/redis/get/:key", async (req, res) => {
  const key = req.params.key;
  try {
    const value = await redisInstance.getValueByKey(key);
    if (value) {
      res.json({ key, value });
    } else {
      res.status(404).json({ error: `Key ${key} not found` });
    }
  } catch (err) {
    console.error('Error getting value from Redis:', err);
    res.status(500).json({ error: 'Error getting value from Redis' });
  }
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
