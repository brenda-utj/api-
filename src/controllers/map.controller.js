const axios = require('axios');
require('dotenv').config();

const mapCtrl = {};

mapCtrl.search = async (req, res) => {
  try {
    const { query, lat, lon, useFullMexico } = req.query;

    if (!query) {
      return res.status(400).json({ error: 'El parámetro "query" es obligatorio.' });
    }

    const apiKey = process.env.SERPAPI_KEY;
    let url;

    if (useFullMexico === 'true') {
      url = `https://serpapi.com/search.json?engine=google_maps_autocomplete&q=${query}&hl=es&gl=mx&api_key=${apiKey}&ll=@23.634501,-102.552784,3z`;
    } else if (lat && lon) {
      url = `https://serpapi.com/search.json?engine=google_maps_autocomplete&q=${query}&hl=es&gl=mx&api_key=${apiKey}&ll=@${lat},${lon},3z`;
    } else {
      return res.status(400).json({ error: 'Los parámetros "lat" y "lon" son obligatorios cuando "useFullMexico" es false.' });
    }

    const response = await axios.get(url);
    
    res.json(response?.data?.suggestions || []);
  } catch (error) {
    console.error('Error al buscar ubicaciones:', error);
    res.status(500).json({ error: 'Error al comunicarse con SerpApi.' });
  }
};

module.exports = mapCtrl;
