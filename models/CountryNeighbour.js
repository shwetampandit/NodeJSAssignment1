const mongoose = require('mongoose');

const countryNeighbourSchema = new mongoose.Schema({
  country_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Country',
    required: true
  },
  neighbour_country_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Country',
    required: true
  }
}, {
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

countryNeighbourSchema.index({ country_id: 1 });
countryNeighbourSchema.index({ neighbour_country_id: 1 });

countryNeighbourSchema.index({ country_id: 1, neighbour_country_id: 1 }, { unique: true });

const CountryNeighbour = mongoose.model('CountryNeighbour', countryNeighbourSchema, 'country_neighbours');

module.exports = CountryNeighbour;

