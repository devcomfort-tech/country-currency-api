import dotenv from "dotenv";
import axios from "axios";

dotenv.config();

async function testCountriesAPI() {
  try {
    const response = await axios.get(
      "https://api.restcountries.com/countries/v5",
      {
        headers: {
          Authorization: `Bearer ${process.env.REST_COUNTRIES_API_KEY}`,
        },
        params: {
          limit: 3,
        },
      }
    );

    console.log(
      "API connection successful!"
    );

    console.log(
      JSON.stringify(response.data.data.objects, null, 2)
    );
  } catch (error: any) {
    console.error(
      "API test failed:",
      error.response?.data || error.message
    );
  }
}

testCountriesAPI();