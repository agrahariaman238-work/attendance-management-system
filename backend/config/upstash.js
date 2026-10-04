const { Redis } = require("@upstash/redis");
const { Ratelimit } = require("@upstash/ratelimit");

const dotenv = require("dotenv");
dotenv.config();

const redis = Redis.fromEnv();

// General API limit, applied to every request (per user, or per IP when logged out)
const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(300, "1 m"),
  prefix: "ratelimit:api",
  timeout: 1000,
});

// Stricter limit for login / OTP endpoints to slow down brute force and email spam
const authRatelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(10, "10 m"),
  prefix: "ratelimit:auth",
  timeout: 1000,
});

module.exports = { ratelimit, authRatelimit };
