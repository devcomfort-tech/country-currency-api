import axios from "axios";
import { ExchangeRateResponse } from "../types/country.types";
import { ExternalApiError } from "../types/app-error";

const EXCHANGE_API_URL =
"https://open.er-api.com/v6/latest/USD";
export async function fetchExchangeRates(): Promise<Record<string, number>> {
  try {
    const response = await axios.get<ExchangeRateResponse>(
      EXCHANGE_API_URL,
      { timeout: 10000 }
    );

    if (response.data.result !== "success") {
      throw new Error("Exchange rate API request failed");
    }

    return response.data.rates;
  } catch (error) {
    throw new ExternalApiError("Exchange Rate API");
  }
}
