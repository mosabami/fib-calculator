const keys = require('./keys');
const redis = require('redis');
const { promisify } = require('util');

const redisHost = keys.redisHost;
const redisHost2 = process.env.REDIS_HOST2 ? process.env.REDIS_HOST2 : redisHost;

const redisClient = redis.createClient({
  host: redisHost,
  port: keys.redisPort,
  retry_strategy: () => 1000,
});

redisClient.on('error', (err) => {
  console.error('Redis error:', err);
});

const redisInserter = redis.createClient({
  host: redisHost,
  port: keys.redisPort,
  retry_strategy: () => 1000,
});

redisInserter.on('error', (err) => {
  console.error('Redis error:', err);
});

// Promisify the hget and hset methods
const hgetAsync = promisify(redisClient.hget).bind(redisClient);
const hsetAsync = promisify(redisInserter.hset).bind(redisInserter);
const brpopAsync = promisify(redisClient.brpop).bind(redisClient);

const fib = async (index) => {
  let indNumber = parseInt(index, 10); // Attempt to parse index as an integer

  if (isNaN(indNumber)) {
    throw new Error(`Invalid index: ${index} is not a numerical value`);
  }

  let key = indNumber.toString(); // Convert key back to string

  try {
    // Check Redis for the value
    const result = await hgetAsync('values', key);
    console.log(`Checking Redis for key: ${key}, result: ${result}`);

    if (result && result !== "Nothing yet!" && !isNaN(result)) {
      // Value found in Redis
      console.log(`Value found in Redis for index ${index}: ${result}`);
      return parseInt(result, 10);
    } else {
      // Value not found in Redis, compute it
      console.log(`Value not found in Redis for index ${index}, computing...`);
      const value = computeFib(indNumber);

      // Return the computed value without storing it in Redis
      console.log(`Computed value for index ${index}: ${value}`);
      return value;
    }
  } catch (err) {
    console.error('Redis error:', err);
    throw err;
  }
};

const computeFib = (index) => {
  if (index < 2) return 1;
  // return 1
  return computeFib(index - 1) + computeFib(index - 2);
};

const processTasks = async () => {
  while (true) {
    try {
      const task = await brpopAsync("tasks", 0); // Block until a task is available
      const index = task[1];
      const result = await fib(index);
      const key = index.toString(); // Convert index back to string for insertion
      console.log(`Inserting into Redis: key: ${key}, value: ${result}`);
      await redisInserter.hset('values', key, result);
    } catch (err) {
      console.error('Error processing task:', err);
    }
  }
};

processTasks();