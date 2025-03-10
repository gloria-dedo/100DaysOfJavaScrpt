const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 8000;

// Serve static files from the SPA directory
app.use(express.static(path.join(__dirname)));

// Serve the index.html file for all routes
app.get("/*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "index.html"));
});

app.listen(PORT, () => {
    console.log(`Server running just like this on port ${PORT}...`);
});

// Error handling for uncaught exceptions
process.on('uncaughtException', (err) => {
    console.error('There was an uncaught error', err);
    process.exit(1); // mandatory (as per the Node.js docs)
});
