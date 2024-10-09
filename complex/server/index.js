const keys = require("./keys");
const { promisify } = require('util');

// Express App Setup
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(bodyParser.json());

const redisHost = keys.redisHost
const redisHost2 = process.env.REDIS_HOST2  ? process.env.REDIS_HOST2 : redisHost;
const upperLimit = process.env.UPPERLIMIT ? parseInt(process.env.UPPERLIMIT, 10) : 200;

// Postgres Client Setup
const { Pool } = require("pg");
const pgClient = new Pool({
  user: keys.pgUser,
  host: keys.pgHost,
  database: keys.pgDatabase,
  password: keys.pgPassword,
  port: keys.pgPort,
});

pgClient.on("connect", (client) => {
  client
    .query("CREATE TABLE IF NOT EXISTS values (number INT)")
    .catch((err) => console.error(err));
});

// Redis Client Setup
const redis = require("redis");
const redisClient = redis.createClient({
  host: redisHost,
  port: keys.redisPort,
  retry_strategy: () => 1000,
});

const redisPublisher = redis.createClient({
  host: redisHost2,
  port: keys.redisPort,
  retry_strategy: () => 1000,
});

const hgetAsync = promisify(redisPublisher.hget).bind(redisPublisher);

const setValueIfNotExists = async (index) => {
  try {
    const existingValue = await hgetAsync("values", index);
    if (!existingValue) {
      await redisPublisher.hset("values", index, "Nothing yet!");
      console.log(`Set value for index ${index} to "Nothing yet!"`);
    } else {
      console.log(`Value for index ${index} already exists: ${existingValue}`);
    }
  } catch (err) {
    console.error(`Error checking or setting value for index ${index}:`, err);
  }
};

// Express route handlers

app.get("/", (req, res) => {
  res.send("Hi");
});

app.get("/values/all", async (req, res) => {
  const values = await pgClient.query("SELECT * from values");

  res.send(values.rows);
});

app.get("/values/current", async (req, res) => {
  redisClient.hgetall("values", (err, values) => {
    res.send(values);
  });
});

app.post("/values", async (req, res) => {
  const index = req.body.index;

  if (parseInt(index) > upperLimit) {
    return res.status(422).send("Index too high");
  }

  await setValueIfNotExists(index);
  await redisPublisher.lpush("tasks", index); // Push the task to the list
  console.log(`Processing Fib for index: ${index}`);
  pgClient.query("INSERT INTO values(number) VALUES($1)", [index]);

  res.send({ working: true });
});

app.listen(5000, (err) => {
  console.log("Listening");
});
