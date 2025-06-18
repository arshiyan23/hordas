const express = require('express');
const cors = require('cors');
require('dotenv').config();

const configRoute = require('./routes/config');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/config', configRoute);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Hordas backend running on http://localhost:${PORT}`);
});
