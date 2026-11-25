
import axios from "axios";
import { CountryApiResponse } from "../types/country.types";
import { ExternalApiError } from "../types/app-error";

const COUNTRIES_API_URL =
  "https://api.restcountries.com/countries/v5";

interface RestCountryV5 {
  names: {
    common: string;
  };
  capitals?: {
    name: string;
  }[];
  region?: string;
  population: number;
  flag?: {
    url_png?: string;
  };
  currencies?: {
    code?: string;
  }[];
}

interface RestCountriesResponse {
  data: {
    objects: RestCountryV5[];
    meta: {
      total: number;
    };
  };
}

export async function fetchCountries(): Promise<CountryApiResponse[]> {
  const apiKey = process.env.REST_COUNTRIES_API_KEY;

  if (!apiKey) {
    throw new ExternalApiError("REST Countries API");
  }

  const allCountries: RestCountryV5[] = [];
  const limit = 100;
  let offset = 0;
  let total = 0;

  do {
    let response;

    try {
      response = await axios.get<RestCountriesResponse>(
        COUNTRIES_API_URL,
        {
          headers: {
            Authorization: `Bearer ${apiKey}`,
          },
          params: {
            limit,
            offset,
          },
          timeout: 15000,
        }
      );
    } catch (error) {
      throw new ExternalApiError("REST Countries API");
    }

    const countries = response.data.data.objects;
    total = response.data.data.meta.total;

    allCountries.push(...countries);
    offset += limit;
  } while (offset < total);

  return allCountries.map((country) => ({
    name: country.names.common,
    capital: country.capitals?.[0]?.name,
    region: country.region,
    population: country.population,
    flag: country.flag?.url_png,
    currencies: country.currencies,
  }));
}
