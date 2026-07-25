const { ratelimit } = require("../config/upstash.js");

const rateLimiter = async (req, res, next) => {
    try {
          let identifier;

        console.log("Rate limiter middleware invoked",req.user);
          if (req.user && req.user.email) {
            identifier = `user:${req.user.email}`;
            console.log("User ID found:", req.user.email);
        } else {
            identifier = `ip:${req.ip}`;
            console.log("No user ID found, using IP address:", req.ip);
        }
        
        const { success } = await ratelimit.limit(identifier);

        if (!success) {
            return res.status(429).json({message: "Too many requests. Please try again later." });
        }
        next();
    }
    catch (error) {
        console.error("Error in rateLimiter middleware:", error);
        next(error);
    }
};

module.exports = rateLimiter;