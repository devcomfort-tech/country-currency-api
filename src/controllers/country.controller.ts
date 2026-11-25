import { Request, Response, NextFunction } from "express";
import { refreshCountries } from "../services/refresh.service";
import pool from "../config/database";
import path from "path";
import fs from "fs";

export async function refreshCountriesController(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    await refreshCountries();

    res.status(200).json({
      message: "Countries refreshed successfully",
    });
  } catch (error) {
    next(error);
  }
}


export async function getAllCountriesController(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { region, currency, sort } = req.query;

    let sql = "SELECT * FROM countries WHERE 1=1";
    const params: any[] = [];

    if (region) {
      sql += " AND LOWER(region) = LOWER(?)";
      params.push(region);
    }

    if (currency) {
      sql += " AND UPPER(currency_code) = UPPER(?)";
      params.push(currency);
    }

    if (sort === "gdp_desc") {
      sql += " ORDER BY estimated_gdp DESC";
    } else if (sort === "gdp_asc") {
      sql += " ORDER BY estimated_gdp ASC";
    } else {
      sql += " ORDER BY name ASC";
    }

    const [rows] = await pool.query(sql, params);

    res.status(200).json({
      count: (rows as any[]).length,
      countries: rows,
    });
  } catch (error) {
    next(error);
  }
}


  export async function getCountryByNameController(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { name } = req.params;
  
      const [rows] = await pool.execute(
        "SELECT * FROM countries WHERE name = ?",
        [name]
      );
  
      const countries = rows as any[];
  
      if (countries.length === 0) {
        res.status(404).json({
          error: "Country not found",
        });
        return;
      }
  
      res.status(200).json(countries[0]);
    } catch (error) {
      next(error);
    }
  }

  export async function deleteCountryController(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { name } = req.params;
  
      const [result] = await pool.execute(
        "DELETE FROM countries WHERE name = ?",
        [name]
      );
  
      const deleteResult = result as { affectedRows: number };
  
      if (deleteResult.affectedRows === 0) {
        res.status(404).json({
          error: "Country not found",
        });
        return;
      }
  
      res.status(200).json({
        message: "Country deleted successfully",
      });
    } catch (error) {
      next(error);
    }
  }

  export async function getStatusController(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const [countryRows] = await pool.query(
        "SELECT COUNT(*) AS totalCountries FROM countries"
      );
  
      const [metadataRows] = await pool.query(
        "SELECT last_refreshed_at FROM app_metadata WHERE id = 1"
      );
  
      const countries = countryRows as { totalCountries: number }[];
      const metadata = metadataRows as { last_refreshed_at: Date | null }[];
  
      res.status(200).json({
        total_countries: countries[0].totalCountries,
        last_refreshed_at: metadata[0]?.last_refreshed_at ?? null,
      });
    } catch (error) {
      next(error);
    }
  }

  export function getSummaryImageController(
    req: Request,
    res: Response
  ): void {
    const imagePath = path.join(
      process.cwd(),
      "cache",
      "summary.png"
    );
  
    if (!fs.existsSync(imagePath)) {
      res.status(404).json({
        error: "Summary image not found",
      });
      return;
    }
  
    res.sendFile(imagePath);
  }