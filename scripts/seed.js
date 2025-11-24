require('dotenv').config();
const mongoose = require('mongoose');
const Country = require('../models/Country');
const CountryNeighbour = require('../models/CountryNeighbour');

const countries = [
  {
    id: 25,
    name: 'India',
    cca3: 'IND',
    currency_code: 'INR',
    currency: 'Indian rupee',
    capital: 'New Delhi',
    region: 'Asia',
    subregion: 'Southern Asia',
    area: 3287590.0,
    map_url: 'https://goo.gl/maps/WSk3fLwG4vtPQetp7',
    population: 1380004385,
    flag_url: 'https://flagcdn.com/w320/in.png'
  },
  {
    id: 1,
    name: 'Pakistan',
    cca3: 'PAK',
    currency_code: 'PKR',
    currency: 'Pakistani rupee',
    capital: 'Islamabad',
    region: 'Asia',
    subregion: 'Southern Asia',
    area: 881912.0,
    map_url: 'https://goo.gl/maps/5LYujdfR5yLUXoERA',
    population: 231402117,
    flag_url: 'https://flagcdn.com/w320/pk.png'
  },
  {
    id: 2,
    name: 'Bangladesh',
    cca3: 'BGD',
    currency_code: 'BDT',
    currency: 'Bangladeshi taka',
    capital: 'Dhaka',
    region: 'Asia',
    subregion: 'Southern Asia',
    area: 147570.0,
    map_url: 'https://goo.gl/maps/op6gYbPaZ8vk7zuU9',
    population: 164689383,
    flag_url: 'https://flagcdn.com/w320/bd.png'
  },
  {
    id: 3,
    name: 'China',
    cca3: 'CHN',
    currency_code: 'CNY',
    currency: 'Chinese yuan',
    capital: 'Beijing',
    region: 'Asia',
    subregion: 'Eastern Asia',
    area: 9706961.0,
    map_url: 'https://goo.gl/maps/p9qC6vgi8RXxdDRG7',
    population: 1402112000,
    flag_url: 'https://flagcdn.com/w320/cn.png'
  },
  {
    id: 4,
    name: 'Nepal',
    cca3: 'NPL',
    currency_code: 'NPR',
    currency: 'Nepalese rupee',
    capital: 'Kathmandu',
    region: 'Asia',
    subregion: 'Southern Asia',
    area: 147181.0,
    map_url: 'https://goo.gl/maps/7vN9oK3z9Q5K5ZJZ8',
    population: 29136808,
    flag_url: 'https://flagcdn.com/w320/np.png'
  },
  {
    id: 5,
    name: 'Bhutan',
    cca3: 'BTN',
    currency_code: 'BTN',
    currency: 'Bhutanese ngultrum',
    capital: 'Thimphu',
    region: 'Asia',
    subregion: 'Southern Asia',
    area: 38394.0,
    map_url: 'https://goo.gl/maps/Jig7ZsK3KJTkX5KU6',
    population: 771612,
    flag_url: 'https://flagcdn.com/w320/bt.png'
  },
  {
    id: 6,
    name: 'Myanmar',
    cca3: 'MMR',
    currency_code: 'MMK',
    currency: 'Myanmar kyat',
    capital: 'Naypyidaw',
    region: 'Asia',
    subregion: 'South-Eastern Asia',
    area: 676578.0,
    map_url: 'https://goo.gl/maps/4gkv5tWKGvW9Cv7G8',
    population: 54409794,
    flag_url: 'https://flagcdn.com/w320/mm.png'
  },
  {
    id: 7,
    name: 'United States',
    cca3: 'USA',
    currency_code: 'USD',
    currency: 'United States dollar',
    capital: 'Washington, D.C.',
    region: 'Americas',
    subregion: 'Northern America',
    area: 9372610.0,
    map_url: 'https://goo.gl/maps/4gkv5tWKGvW9Cv7G8',
    population: 329484123,
    flag_url: 'https://flagcdn.com/w320/us.png'
  },
  {
    id: 8,
    name: 'United Kingdom',
    cca3: 'GBR',
    currency_code: 'GBP',
    currency: 'British pound',
    capital: 'London',
    region: 'Europe',
    subregion: 'Northern Europe',
    area: 242900.0,
    map_url: 'https://goo.gl/maps/FoDtc3UKMkFsXAjHA',
    population: 67281039,
    flag_url: 'https://flagcdn.com/w320/gb.png'
  },
  {
    id: 9,
    name: 'Russia',
    cca3: 'RUS',
    currency_code: 'RUB',
    currency: 'Russian ruble',
    capital: 'Moscow',
    region: 'Europe',
    subregion: 'Eastern Europe',
    area: 17124442.0,
    map_url: 'https://goo.gl/maps/4gkv5tWKGvW9Cv7G8',
    population: 144104080,
    flag_url: 'https://flagcdn.com/w320/ru.png'
  },
  {
    id: 10,
    name: 'Japan',
    cca3: 'JPN',
    currency_code: 'JPY',
    currency: 'Japanese yen',
    capital: 'Tokyo',
    region: 'Asia',
    subregion: 'Eastern Asia',
    area: 377930.0,
    map_url: 'https://goo.gl/maps/NGofhF5L6yQXF8Wf8',
    population: 125836021,
    flag_url: 'https://flagcdn.com/w320/jp.png'
  }
];

async function seedDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/countries_db', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log('Connected to MongoDB');

    await Country.deleteMany({});
    await CountryNeighbour.deleteMany({});
    console.log('Cleared existing data');

    const insertedCountries = await Country.insertMany(countries);
    console.log(`Inserted ${insertedCountries.length} countries`);

    const india = insertedCountries.find(c => c.id === 25);
    if (india) {
      const neighbours = [
        { country_id: india._id, neighbour_country_id: insertedCountries.find(c => c.id === 1)?._id },
        { country_id: india._id, neighbour_country_id: insertedCountries.find(c => c.id === 2)?._id },
        { country_id: india._id, neighbour_country_id: insertedCountries.find(c => c.id === 3)?._id },
        { country_id: india._id, neighbour_country_id: insertedCountries.find(c => c.id === 4)?._id },
        { country_id: india._id, neighbour_country_id: insertedCountries.find(c => c.id === 5)?._id },
        { country_id: india._id, neighbour_country_id: insertedCountries.find(c => c.id === 6)?._id },
      ].filter(n => n.neighbour_country_id);

      if (neighbours.length > 0) {
        await CountryNeighbour.insertMany(neighbours);
        console.log(`Created ${neighbours.length} neighbour relationships for India`);
      }
    }

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();

