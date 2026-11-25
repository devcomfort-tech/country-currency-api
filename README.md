# Country Currency & Exchange API

A RESTful API built with Node.js, TypeScript, Express, and MySQL that retrieves country information and USD exchange rates, calculates estimated GDP values, stores country data in a database, and provides endpoints for querying, filtering, sorting, and managing country records.

## Features

- Fetch country data from the REST Countries API.
- Fetch USD exchange rates from the Exchange Rate API.
- Calculate estimated GDP using population, a random multiplier, and exchange rate.
- Store and update country records in MySQL.
- Refresh country data on demand.
- Filter countries by region and currency.
- Sort countries by estimated GDP.
- Retrieve individual country information.
- Delete country records.
- View API status and refresh timestamps.
- Generate a PNG summary image of country statistics and top countries by estimated GDP.
- Handle external API failures with appropriate HTTP responses.

## Technologies Used

- Node.js
- TypeScript
- Express.js
- MySQL 8
- Axios
- Sharp
- dotenv
- REST Countries API
- Exchange Rate API

## Project Structure

\`\`\`
country-currency-api/
├── cache/
├── src/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── routes/
│   ├── services/
│   ├── types/
│   ├── app.ts
│   └── server.ts
├── .env
├── .env.example
├── .gitignore
├── package.json
├── package-lock.json
├── tsconfig.json
└── README.md
\`\`\`

## Requirements

Before installing the project, ensure you have:

- Node.js and npm installed.
- MySQL Server 8 installed and running.
- A REST Countries API key.

## Installation

Clone the repository:

\`\`\`bash
git clone <your-github-repository-url>
\`\`\`

Navigate into the project directory:

\`\`\`bash
cd country-currency-api
\`\`\`

Install dependencies:

\`\`\`bash
npm install
\`\`\`

## Database Setup

Create the database:

\`\`\`sql
CREATE DATABASE country_currency_db;
\`\`\`

Select the database:

\`\`\`sql
USE country_currency_db;
\`\`\`

Create the countries table:

\`\`\`sql
CREATE TABLE countries (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    capital VARCHAR(150) NULL,
    region VARCHAR(100) NULL,
    population BIGINT NOT NULL,
    currency_code VARCHAR(10) NULL,
    exchange_rate DECIMAL(20, 8) NULL,
    estimated_gdp DECIMAL(25, 2) NULL,
    flag_url TEXT NULL,
    last_refreshed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_countries_name UNIQUE (name)
);
\`\`\`

Create the application metadata table:

\`\`\`sql
CREATE TABLE app_metadata (
    id TINYINT PRIMARY KEY,
    last_refreshed_at TIMESTAMP NULL DEFAULT NULL
);

INSERT INTO app_metadata (id, last_refreshed_at)
VALUES (1, NULL);
\`\`\`

## Environment Configuration

Create a `.env` file in the project root.

Use `.env.example` as a reference and configure your own credentials:

\`\`\`env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=country_currency_db
DB_PORT=3306
REST_COUNTRIES_API_KEY=your_rest_countries_api_key
\`\`\`

Replace the placeholder values with your actual local configuration.

**Never commit your `.env` file or expose API keys and database passwords publicly.**

## Running the Application

Start the development server:

\`\`\`bash
npm run dev
\`\`\`

The server runs on:

\`\`\`
http://localhost:5000
\`\`\`

## Building for Production

Compile the TypeScript source code:

\`\`\`bash
npm run build
\`\`\`

Start the compiled application:

\`\`\`bash
npm start
\`\`\`

## API Endpoints

Base URL:

\`\`\`
http://localhost:5000
\`\`\`

### 1. Refresh Countries

Fetch country data and exchange rates, calculate estimated GDP, update the database, and generate the summary image.

**Endpoint**

\`\`\`
POST /countries/refresh
\`\`\`

**Example**

\`\`\`http
POST http://localhost:5000/countries/refresh
\`\`\`

### 2. Get All Countries

Retrieve all stored countries.

**Endpoint**

\`\`\`
GET /countries
\`\`\`

### 3. Filter Countries by Region

\`\`\`
GET /countries?region=Africa
\`\`\`

### 4. Filter Countries by Currency

\`\`\`
GET /countries?currency=NGN
\`\`\`

### 5. Sort Countries by Estimated GDP

GDP in descending order:

\`\`\`
GET /countries?sort=gdp_desc
\`\`\`

GDP in ascending order:

\`\`\`
GET /countries?sort=gdp_asc
\`\`\`

Filters and sorting can be combined:

\`\`\`
GET /countries?region=Africa&currency=NGN&sort=gdp_desc
\`\`\`

### 6. Get a Country by Name

\`\`\`
GET /countries/Nigeria
\`\`\`

### 7. Delete a Country

\`\`\`
DELETE /countries/Nigeria
\`\`\`

### 8. Get API Status

Returns the total number of countries stored and the last refresh timestamp.

\`\`\`
GET /status
\`\`\`

### 9. Get Summary Image

Returns the generated PNG summary image.

\`\`\`
GET /countries/image
\`\`\`

The summary image displays the total number of countries, last refresh time, and the top five countries by estimated GDP.

## Estimated GDP Calculation

Estimated GDP is calculated using:

\`\`\`
Estimated GDP = Population × Random Multiplier ÷ Exchange Rate
\`\`\`

The random multiplier is generated between 1,000 and 2,000 whenever the country data is refreshed.

Exchange rates are retrieved relative to USD.

## Currency Handling

- Countries without a currency receive a null currency code, null exchange rate, and estimated GDP of 0.
- Countries whose currency is not available in the exchange rate API receive a null exchange rate and null estimated GDP.
- Where multiple currencies exist, the first currency is used.

## Error Handling

The API uses appropriate HTTP status codes:

| Status Code | Description |
|---|---|
| 200 | Request successful |
| 400 | Invalid request |
| 404 | Country or summary image not found |
| 500 | Internal server error |
| 503 | External data source unavailable |

Example external API error:

\`\`\`json
{
  "error": "External data source unavailable",
  "details": "Could not fetch data from Exchange Rate API"
}
\`\`\`

## Data Sources

- REST Countries API: Country names, capitals, regions, populations, flags, and currencies.
- Exchange Rate API: USD-based currency exchange rates.

## Author

Developed as a backend API project using Node.js, TypeScript, Express, and MySQL.