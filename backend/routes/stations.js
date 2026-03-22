// const express = require('express');
// const router = express.Router();

// // GET /api/stations
// router.get('/', async (req, res) => {
//   try {
//     const apiKey = 'bf570013-018e-41ff-bc9c-98ccb09fb821';
//     const url = `https://api.openchargemap.io/v3/poi/?output=json&countrycode=IN&latitude=12.9716&longitude=77.5946&distance=15&distanceunit=km&maxresults=100&compact=false&verbose=false&key=${apiKey}`;

//     const response = await fetch(url);
//     const data = await response.json();

//     res.json({
//       count: data.length,
//       stations: data
//     });

//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// module.exports = router;
const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.json({ message: 'stations route working' });
});

module.exports = router;