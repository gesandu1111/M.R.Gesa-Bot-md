const express = require('express');
const app = express();
const PORT = 3000;

// Serve static files from /public
app.use(express.static('public'));

app.listen(PORT, () => {
  console.log(`🌐 HASA Dashboard available at http://localhost:${PORT}/dashboard.html`);
});
