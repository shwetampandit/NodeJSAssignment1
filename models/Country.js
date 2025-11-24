const mongoose = require('mongoose');

const countrySchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  cca3: {
    type: String,
    required: true
  },
  currency_code: {
    type: String,
    required: true
  },
  currency: {
    type: String,
    required: true
  },
  capital: {
    type: String,
    required: true
  },
  region: {
    type: String,
    required: true
  },
  subregion: {
    type: String,
    required: true
  },
  area: {
    type: Number,
    required: true
  },
  map_url: {
    type: String,
    required: true
  },
  population: {
    type: Number,
    required: true
  },
  flag_url: {
    type: String,
    required: true
  }
}, {
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

countrySchema.index({ id: 1 });
countrySchema.index({ name: 1 });
countrySchema.index({ region: 1 });
countrySchema.index({ subregion: 1 });
countrySchema.index({ population: 1 });
countrySchema.index({ area: 1 });

const Country = mongoose.model('Country', countrySchema, 'countries');

module.exports = Country;

