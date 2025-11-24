# Countries REST API

A comprehensive RESTful API service developed with Node.js and Express.js, designed to manage and retrieve country information through MongoDB. This application provides endpoints for listing, searching, sorting, and paginating country data, along with functionality to retrieve neighboring country relationships.

## Overview

This API serves as a backend service for mobile and web applications that require access to country information. It implements robust error handling, supports multiple sorting options, provides pagination capabilities, and includes advanced filtering features.

## Features

- **Country Management**: Retrieve all countries with comprehensive details
- **Country Lookup**: Get detailed information for specific countries by ID
- **Neighbor Relationships**: Query neighboring countries for any given country
- **Advanced Sorting**: Multiple sorting options including alphabetical, population, and area-based sorting
- **Pagination Support**: Efficient data retrieval with configurable page size
- **Search & Filter**: Filter countries by name, region, and subregion
- **Error Handling**: Comprehensive error responses with appropriate HTTP status codes
- **Database Indexing**: Optimized queries with strategic database indexes

## Technology Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Environment**: dotenv for configuration management

## Prerequisites

Before setting up this project, ensure you have the following installed:

- Node.js (version 14 or higher)
- MongoDB (version 4.4 or higher) - either local installation or connection string
- npm (Node Package Manager) or yarn

## Installation

1. Clone or download this repository to your local machine

2. Navigate to the project directory:
```bash
cd NodeJSAssignment
```

3. Install project dependencies:
```bash
npm install
```

4. Create a `.env` file in the root directory with the following configuration:
```
PORT=5001
MONGODB_URI=mongodb://localhost:27017/countries_db
NODE_ENV=development
```

Adjust the `MONGODB_URI` according to your MongoDB setup. For cloud instances, use the appropriate connection string.

5. Ensure MongoDB is running on your system. If using a local installation, start the MongoDB service.

## Database Seeding

To populate the database with sample country data, run the seed script:

```bash
npm run seed
```

This command will:
- Create sample countries in the database
- Establish neighbor relationships (India and its neighboring countries)
- Clear any existing data before inserting new records

## Running the Application

Start the server using one of the following commands:

**Production mode:**
```bash
npm start
```

**Development mode (with auto-reload):**
```bash
npm run dev
```

The API will be available at `http://localhost:5001` (or the port specified in your `.env` file).

## API Endpoints

### Base URL
All endpoints are prefixed with `/country`

### 1. Get All Countries

Retrieve a paginated list of countries with optional sorting and filtering.

**Endpoint:** `GET /country`

**Query Parameters:**
- `sort_by` (optional): Sorting criteria
  - `a_to_z` - Alphabetical order (default)
  - `z_to_a` - Reverse alphabetical order
  - `population_high_to_low` - Population descending
  - `population_low_to_high` - Population ascending
  - `area_high_to_low` - Area descending
  - `area_low_to_high` - Area ascending
- `page` (optional): Page number (default: 1)
- `limit` (optional): Records per page (default: 10)
- `name` (optional): Filter by country name (case-insensitive partial match)
- `region` (optional): Filter by region
- `subregion` (optional): Filter by subregion

**Example Request:**
```bash
curl --location 'http://localhost:5001/country?sort_by=a_to_z&page=1&limit=10&name=united&region=asia'
```

**Response Format:**
```json
{
  "message": "Country list",
  "data": {
    "list": [...],
    "has_next": true,
    "has_prev": false,
    "page": 1,
    "pages": 10,
    "per_page": 10,
    "total": 98
  }
}
```

### 2. Get Country by ID

Retrieve detailed information for a specific country.

**Endpoint:** `GET /country/:id`

**Path Parameters:**
- `id` - Country ID (integer)

**Example Request:**
```bash
curl --location 'http://localhost:5001/country/25'
```

**Success Response (200):**
```json
{
  "message": "Country detail",
  "data": {
    "country": {
      "id": 25,
      "name": "India",
      "cca3": "IND",
      "currency_code": "INR",
      "currency": "Indian rupee",
      "capital": "New Delhi",
      "region": "Asia",
      "subregion": "Southern Asia",
      "area": 3287590.0,
      "map_url": "https://goo.gl/maps/WSk3fLwG4vtPQetp7",
      "population": 1380004385,
      "flag_url": "https://flagcdn.com/w320/in.png"
    }
  }
}
```

**Error Response (404):**
```json
{
  "message": "Country not found",
  "data": {}
}
```

### 3. Get Country Neighbors

Retrieve all neighboring countries for a specific country.

**Endpoint:** `GET /country/:id/neighbour`

**Path Parameters:**
- `id` - Country ID (integer)

**Example Request:**
```bash
curl --location 'http://localhost:5001/country/25/neighbour'
```

**Success Response (200) - With neighbors:**
```json
{
  "message": "Country neighnbours",
  "data": {
    "countries": [...]
  }
}
```

**Success Response (200) - No neighbors:**
```json
{
  "message": "Country neighnbours",
  "data": {
    "list": []
  }
}
```

**Error Response (404):**
```json
{
  "message": "Country not found",
  "data": {}
}
```

## Response Format

All API responses follow a consistent structure:

```json
{
  "message": "Descriptive message for the client",
  "data": {
    // Response data object or empty object
  }
}
```

## HTTP Status Codes

The API uses standard HTTP status codes:

- **200 OK**: Successful request
- **400 Bad Request**: Invalid input data or malformed request
- **404 Not Found**: Requested resource not found
- **500 Internal Server Error**: Unexpected server error

## Database Schema

### Countries Collection

The `countries` collection stores country information with the following structure:

- `id` (Number, unique, required): Unique country identifier
- `name` (String, required): Country name
- `cca3` (String, required): Three-letter country code
- `currency_code` (String, required): Currency code (e.g., INR, USD)
- `currency` (String, required): Full currency name
- `capital` (String, required): Capital city
- `region` (String, required): Geographic region
- `subregion` (String, required): Geographic subregion
- `area` (Number, required): Country area in square kilometers
- `map_url` (String, required): Google Maps URL
- `population` (Number, required): Country population
- `flag_url` (String, required): Flag image URL
- `created_at` (DateTime): Record creation timestamp
- `updated_at` (DateTime): Record update timestamp

### Country Neighbors Collection

The `country_neighbours` collection maintains neighbor relationships:

- `country_id` (ObjectId, required): Reference to Country
- `neighbour_country_id` (ObjectId, required): Reference to Neighbor Country
- `created_at` (DateTime): Relationship creation timestamp
- `updated_at` (DateTime): Relationship update timestamp

## Project Structure

```
NodeJSAssignment/
├── controllers/
│   └── countryController.js      # Business logic for country operations
├── models/
│   ├── Country.js                 # Country data model
│   └── CountryNeighbour.js        # Neighbor relationship model
├── routes/
│   └── countryRoutes.js           # API route definitions
├── middleware/
│   └── errorHandler.js            # Global error handling middleware
├── scripts/
│   └── seed.js                    # Database seeding script
├── server.js                      # Application entry point
├── package.json                   # Project dependencies and scripts
└── .env                          # Environment configuration (create this)
```

## Error Handling

The application includes comprehensive error handling:

- **Validation Errors**: Handles invalid input data with 400 status codes
- **Not Found Errors**: Returns 404 for non-existent resources
- **Database Errors**: Manages MongoDB connection and query errors
- **Duplicate Entry Errors**: Prevents duplicate data insertion
- **Cast Errors**: Handles invalid ID formats

All errors return a consistent JSON response format with descriptive messages.

## Security Considerations

- Environment variables used for sensitive configuration
- Input validation on all endpoints
- MongoDB injection prevention through Mongoose
- CORS enabled for cross-origin requests
- Error messages don't expose internal system details

## Performance Optimizations

- Database indexes on frequently queried fields (id, name, region, subregion, population, area)
- Efficient pagination implementation
- Lean queries where appropriate to reduce memory usage
- Optimized sorting and filtering operations

## Development

For development with automatic server restart on file changes:

```bash
npm run dev
```

This requires `nodemon` to be installed (included in devDependencies).

## Testing the API

You can test the API endpoints using:

- **cURL**: Command-line tool for making HTTP requests
- **Postman**: API development and testing platform
- **Insomnia**: REST client for API testing
- **Browser**: For GET requests (direct navigation)

## License

ISC

## Support

For issues, questions, or contributions, please refer to the project repository or contact the development team.

