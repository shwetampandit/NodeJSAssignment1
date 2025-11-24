const Country = require('../models/Country');
const CountryNeighbour = require('../models/CountryNeighbour');

const formatCountry = (country) => {
  return {
    id: country.id,
    name: country.name,
    cca3: country.cca3,
    currency_code: country.currency_code,
    currency: country.currency,
    capital: country.capital,
    region: country.region,
    subregion: country.subregion,
    area: country.area,
    map_url: country.map_url,
    population: country.population,
    flag_url: country.flag_url
  };
};

const buildSortQuery = (sortBy) => {
  switch (sortBy) {
    case 'z_to_a':
      return { name: -1 };
    case 'population_high_to_low':
      return { population: -1 };
    case 'population_low_to_high':
      return { population: 1 };
    case 'area_high_to_low':
      return { area: -1 };
    case 'area_low_to_high':
      return { area: 1 };
    case 'a_to_z':
    default:
      return { name: 1 };
  }
};

const buildFilterQuery = (name, region, subregion) => {
  const filter = {};
  
  if (name && name.trim() !== '') {
    filter.name = { $regex: name.trim(), $options: 'i' };
  }
  
  if (region && region.trim() !== '') {
    filter.region = { $regex: region.trim(), $options: 'i' };
  }
  
  if (subregion && subregion.trim() !== '') {
    filter.subregion = { $regex: subregion.trim(), $options: 'i' };
  }
  
  return filter;
};

exports.getAllCountries = async (req, res, next) => {
  try {
    const { sort_by, page, limit, name, region, subregion } = req.query;
    
    const sortBy = sort_by || 'a_to_z';
    const pageNum = parseInt(page) || 1;
    const limitNum = parseInt(limit) || 10;
    const skip = (pageNum - 1) * limitNum;
    
    const filter = buildFilterQuery(name, region, subregion);
    const sort = buildSortQuery(sortBy);
    
    const total = await Country.countDocuments(filter);
    
    const countries = await Country.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limitNum)
      .lean();
    
    const pages = Math.ceil(total / limitNum);
    const hasNext = pageNum < pages;
    const hasPrev = pageNum > 1;
    
    const formattedCountries = countries.map(formatCountry);
    
    res.status(200).json({
      message: 'Country list',
      data: {
        list: formattedCountries,
        has_next: hasNext,
        has_prev: hasPrev,
        page: pageNum,
        pages: pages,
        per_page: limitNum,
        total: total
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.getCountryById = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const countryId = parseInt(id);
    if (isNaN(countryId)) {
      return res.status(400).json({
        message: 'Invalid country ID',
        data: {}
      });
    }
    
    const country = await Country.findOne({ id: countryId }).lean();
    
    if (!country) {
      return res.status(404).json({
        message: 'Country not found',
        data: {}
      });
    }
    
    res.status(200).json({
      message: 'Country detail',
      data: {
        country: formatCountry(country)
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.getCountryNeighbours = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const countryId = parseInt(id);
    if (isNaN(countryId)) {
      return res.status(400).json({
        message: 'Invalid country ID',
        data: {}
      });
    }
    
    const country = await Country.findOne({ id: countryId });
    
    if (!country) {
      return res.status(404).json({
        message: 'Country not found',
        data: {}
      });
    }
    
    const neighbours = await CountryNeighbour.find({ country_id: country._id })
      .populate('neighbour_country_id')
      .lean();
    
    const neighbourCountries = neighbours
      .map(n => n.neighbour_country_id)
      .filter(c => c !== null)
      .map(formatCountry);
    
    const responseData = neighbourCountries.length > 0
      ? { countries: neighbourCountries }
      : { list: [] };
    
    res.status(200).json({
      message: 'Country neighnbours',
      data: responseData
    });
  } catch (error) {
    next(error);
  }
};

