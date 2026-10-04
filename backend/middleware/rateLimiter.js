const { ratelimit, authRatelimit } = require("../config/upstash.js");

const createRateLimiter = (limiter) => async (req, res, next) => {
  const identifier =
    req.user && req.user.email ? `user:${req.user.email}` : `ip:${req.ip}`;

  let success = true;
  try {
    ({ success } = await limiter.limit(identifier));
  } catch (error) {
    // Fail open: a Redis outage should not take the whole API down
    console.error("Rate limiter unavailable, allowing request:", error.message);
  }

  if (!success) {
    return res
      .status(429)
      .json({ message: "Too many requests. Please try again later." });
  }
  next();
};

const rateLimiter = createRateLimiter(ratelimit);
const authRateLimiter = createRateLimiter(authRatelimit);

module.exports = rateLimiter;
module.exports.authRateLimiter = authRateLimiter;
