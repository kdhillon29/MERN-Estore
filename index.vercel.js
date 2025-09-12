// Import your server main file
import app from "./backend/server.js";

// Export a serverless function handler
module.exports = (req, res) => {
  return app(req, res);
};
