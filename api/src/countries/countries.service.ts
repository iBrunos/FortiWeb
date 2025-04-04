import { Injectable } from '@nestjs/common';
import fetch from 'node-fetch';
import * as https from 'https';

@Injectable()
export class CountriesService {
  private readonly API_URL = 'https://172.30.1.254/api/v2.0/system/status.monitor?interval=43200';
  private readonly AUTH_TOKEN = "eyJ1c2VybmFtZSI6ImFwaSIsInBhc3N3b3JkIjoiQXBpQDEyMzQ1IiwidmRvbSI6InJvb3QifQo=";

  private countryCodeMap: Record<string, string> = {
    "United States": "us",
    "Brazil": "br",
    "Germany": "de",
    "France": "fr",
    "United Kingdom": "gb",
    "Canada": "ca",
    "China": "cn",
    "Russia": "ru",
    "India": "in",
    "Japan": "jp",
    "Australia": "au",
    "South Korea": "kr",
    "Mexico": "mx",
    "Italy": "it",
    "Spain": "es",
    "Argentina": "ar",
    "Portugal": "pt",
    "South Africa": "za",
    "Saudi Arabia": "sa",
    "Turkey": "tr",
    "Netherlands": "nl",
    "Reserved": "unknown",
    "Vietnam": "vn",
    "Poland": "pl",
    "Uruguay": "uy",
    "Cambodia": "kh",
    "Estonia": "ee",
    "Albania": "al",
    "Romania": "ro",
    "Sweden": "se",
    "Chile": "cl",
    "Moldova": "md",
    "Pakistan": "pk",
    "Republic Of Korea": "kr",
    "Colombia": "co",
    "Finland": "fi",
    "Ireland": "ie",
    "Venezuela": "ve",
    "Peru": "pe",
    "Bulgaria": "bg",
    "Morocco": "ma",
    "Switzerland": "ch",
    "Bangladesh": "bd",
    "Egypt": "eg",
    "Czech Republic": "cz",
    "Paraguay": "py",
    "Panama": "pa",
    "New Zealand": "nz",
    "Myanmar": "mm",
    "Kazakhstan": "kz",
    "Dominican Republic": "do",
    "Tunisia": "tn",
    "Austria": "at",
    "Taiwan": "tw",
    "Iraq": "iq",
    "Sri Lanka": "lk",
    "Burundi": "bi",
    "Bolivia": "bo",
    "Angola": "ao",
    "Qatar": "qa",
    "Tanzania": "tz",
    "Jordan": "jo",
    "Latvia": "lv",
    "Yemen": "ye",
    "Cote D'Ivoire": "ci",
    "Cape Verde": "cv",
    "Algeria": "dz",
    "Croatia": "hr",
    "Belgium": "be",
    "Mozambique": "mz",
    "Ecuador": "ec",
    "United Arab Emirates": "ae",
    "Tajikistan": "tj",
    "Nepal": "np",
    "Lao People'S Democratic Republic": "la",
    "Swaziland": "sz",
  };

  async getThreatsByCountry(): Promise<{ country: string; count: number; flag: string }[]> {
    try {
      const response = await fetch(this.API_URL, {
        method: 'GET',
        headers: {
          Authorization: this.AUTH_TOKEN,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        agent: new https.Agent({
          rejectUnauthorized: false,
        }),
      });

      if (!response.ok) {
        throw new Error(`Erro ao buscar dados: ${response.status}`);
      }

      const body = await response.json();

      if (body.results && body.results.threat_by_countries) {
        return body.results.threat_by_countries.map((item: any) => {
          const countryName = item.country || "Desconhecido";
          const countryCode = this.countryCodeMap[countryName] || "unknown";
          const flagUrl = `https://flagcdn.com/w40/${countryCode}.png`;

          return {
            country: countryName,
            count: parseInt(item.count, 10) || 0,
            flag: flagUrl,
          };
        });
      }

      throw new Error('A resposta da API não contém os dados esperados.');
    } catch (error) {
      throw new Error(`Erro ao fazer a requisição: ${error.message}`);
    }
  }
}