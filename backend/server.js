const express = require('express');
const cors = require('cors');
const stationsRouter = require('./routes/stations');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/stations', stationsRouter);

// Test route
app.get('/', (req, res) => {
  res.json({ message: 'ChargeIQ API is running' });
});

app.listen(PORT, () => {
  console.log(`ChargeIQ backend running on http://localhost:${PORT}`);
});