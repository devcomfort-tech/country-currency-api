export interface Country {
    id?: number;
    name: string;
    capital: string | null;
    region: string | null;
    population: number;
    currency_code: string | null;
    exchange_rate: number | null;
    estimated_gdp: number | null;
    flag_url: string | null;
    last_refreshed_at?: Date;
  }
  
  export interface CountryApiResponse {
    name: string;
    capital?: string;
    region?: string;
    population: number;
    flag?: string;
    currencies?: {
      code?: string;
    }[];
  }
  
  export interface ExchangeRateResponse {
    result: string;
    rates: Record<string, number>;
  }