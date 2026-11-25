import sharp from "sharp";
import fs from "fs/promises";
import path from "path";

interface TopCountry {
  name: string;
  estimated_gdp: number | string | null;
}

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function generateSummaryImage(
  totalCountries: number,
  refreshedAt: Date,
  topCountries: TopCountry[]
): Promise<void> {
  const timestamp = escapeXml(refreshedAt.toLocaleString());

  const countryRows = topCountries
    .map((country, index) => {
      const name = escapeXml(country.name);
      const gdp = Number(country.estimated_gdp || 0)
        .toLocaleString("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        });

      const y = 310 + index * 55;

      return `
        <text x="90" y="${y}" font-size="23" fill="#FFFFFF">
          ${index + 1}. ${name}
        </text>
        <text x="710" y="${y}" font-size="23"
          fill="#BCCCDC" text-anchor="end">
          ${gdp}
        </text>
      `;
    })
    .join("");

  const svg = `
    <svg width="800" height="650" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#102A43"/>

      <text x="400" y="75" font-size="36"
        fill="#FFFFFF" text-anchor="middle"
        font-weight="bold">
        COUNTRY CURRENCY API
      </text>

      <text x="400" y="145" font-size="27"
        fill="#FFFFFF" text-anchor="middle">
        Total Countries: ${totalCountries}
      </text>

      <text x="400" y="195" font-size="19"
        fill="#BCCCDC" text-anchor="middle">
        Last Refreshed: ${timestamp}
      </text>

      <text x="400" y="265" font-size="25"
        fill="#F6C453" text-anchor="middle"
        font-weight="bold">
        TOP 5 COUNTRIES BY ESTIMATED GDP
      </text>

      ${countryRows}
    </svg>
  `;

  await sharp(Buffer.from(svg))
    .png()
    .toFile("cache/summary.png");
}
