const { Redis } = require("@upstash/redis");
const { Ratelimit } = require("@upstash/ratelimit");

const dotenv = require("dotenv");
dotenv.config();

//create a new ratelimiter, that allows 5 requests per minute
const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(30, "1 m"),
});

module.exports = { ratelimit };