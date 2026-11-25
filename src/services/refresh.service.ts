import pool from "../config/database";

import { fetchCountries } from "./country.service";
import { fetchExchangeRates } from "./exchange.service";
import { generateSummaryImage } from "./image.service";

import { Country, CountryApiResponse } from "../types/country.types";

function calculateEstimatedGDP(
  population: number,
  exchangeRate: number
): number {
  const multiplier = Math.floor(Math.random() * 1001) + 1000;

  return (population * multiplier) / exchangeRate;
}

function processCountry(
  country: CountryApiResponse,
  exchangeRates: Record<string, number>
): Omit<Country, "id" | "last_refreshed_at"> {
  const currencyCode = country.currencies?.[0]?.code ?? null;

  if (!currencyCode) {
    return {
      name: country.name,
      capital: country.capital ?? null,
      region: country.region ?? null,
      population: country.population,
      currency_code: null,
      exchange_rate: null,
      estimated_gdp: 0,
      flag_url: country.flag ?? null,
    };
  }

  const exchangeRate = exchangeRates[currencyCode];

  if (exchangeRate === undefined) {
    return {
      name: country.name,
      capital: country.capital ?? null,
      region: country.region ?? null,
      population: country.population,
      currency_code: currencyCode,
      exchange_rate: null,
      estimated_gdp: null,
      flag_url: country.flag ?? null,
    };
  }

  return {
    name: country.name,
    capital: country.capital ?? null,
    region: country.region ?? null,
    population: country.population,
    currency_code: currencyCode,
    exchange_rate: exchangeRate,
    estimated_gdp: calculateEstimatedGDP(
      country.population,
      exchangeRate
    ),
    flag_url: country.flag ?? null,
  };
}

export async function refreshCountries(): Promise<void> {
  const countries = await fetchCountries();
  const exchangeRates = await fetchExchangeRates();

  const processedCountries = countries.map((country) =>
    processCountry(country, exchangeRates)
  );

  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    for (const country of processedCountries) {
      await connection.execute(
        `
        INSERT INTO countries (
          name,
          capital,
          region,
          population,
          currency_code,
          exchange_rate,
          estimated_gdp,
          flag_url,
          last_refreshed_at
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())
        ON DUPLICATE KEY UPDATE
          capital = VALUES(capital),
          region = VALUES(region),
          population = VALUES(population),
          currency_code = VALUES(currency_code),
          exchange_rate = VALUES(exchange_rate),
          estimated_gdp = VALUES(estimated_gdp),
          flag_url = VALUES(flag_url),
          last_refreshed_at = NOW()
        `,
        [
          country.name,
          country.capital,
          country.region,
          country.population,
          country.currency_code,
          country.exchange_rate,
          country.estimated_gdp,
          country.flag_url,
        ]
      );
    }

    await connection.execute(
      `
      UPDATE app_metadata
      SET last_refreshed_at = NOW()
      WHERE id = 1
      `
    );

    await connection.commit();
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }

  const [topCountries] = await pool.query(
    `
    SELECT name, estimated_gdp
    FROM countries
    WHERE estimated_gdp IS NOT NULL
    ORDER BY estimated_gdp DESC
    LIMIT 5
    `
  );

  await generateSummaryImage(
    processedCountries.length,
    new Date(),
    topCountries as {
      name: string;
      estimated_gdp: number | string | null;
    }[]
  );
}
