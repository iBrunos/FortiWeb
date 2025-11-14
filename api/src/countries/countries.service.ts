import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import fetch from 'node-fetch';
import * as https from 'https';

interface FortiwebAdomConfig {
  name: string;
  baseUrl: string;
  username: string;
  password: string;
  adoms: string[];
}

@Injectable()
export class CountriesService {
  private readonly fortiwebs: FortiwebAdomConfig[];
  private readonly httpsAgent = new https.Agent({ rejectUnauthorized: false });

  constructor(private readonly configService: ConfigService) {
    this.fortiwebs = [1, 2, 3, 4]
      .map((index) => {
        const name = this.configService.get<string>(`FORTIWEB${index}_NAME`);
        const baseUrl = this.configService.get<string>(`FORTIWEB${index}_URL`);
        const username = this.configService.get<string>(`FORTIWEB${index}_USER`);
        const password = this.configService.get<string>(`FORTIWEB${index}_PASS`);
        const adoms =
          this.configService.get<string>(`FORTIWEB${index}_ADOMS`)?.split(',') ||
          [];

        if (name && baseUrl && username && password && adoms.length) {
          return { name, baseUrl, username, password, adoms };
        }
        return null;
      })
      .filter((f): f is FortiwebAdomConfig => f !== null);
  }

  // ------------------------------
  // Gera token por FortiWeb + ADOM
  // ------------------------------
  private generateToken(fortiweb: FortiwebAdomConfig, adom: string): string {
    return Buffer.from(
      JSON.stringify({
        username: fortiweb.username,
        password: fortiweb.password,
        vdom: adom,
      }),
    ).toString('base64');
  }

  // -----------------------
  // Mapa de países -> código
  // -----------------------
  private countryCodeMap: Record<string, string> = {
    "Afghanistan": "af",
    "Albania": "al",
    "Algeria": "dz",
    "Andorra": "ad",
    "Angola": "ao",
    "Antigua and Barbuda": "ag",
    "Argentina": "ar",
    "Armenia": "am",
    "Australia": "au",
    "Austria": "at",
    "Azerbaijan": "az",
    "Bahamas": "bs",
    "Bahrain": "bh",
    "Bangladesh": "bd",
    "Barbados": "bb",
    "Belarus": "by",
    "Belgium": "be",
    "Belize": "bz",
    "Benin": "bj",
    "Bhutan": "bt",
    "Bolivia": "bo",
    "Bosnia and Herzegovina": "ba",
    "Botswana": "bw",
    "Brazil": "br",
    "Brunei": "bn",
    "Bulgaria": "bg",
    "Burkina Faso": "bf",
    "Burundi": "bi",
    "Cabo Verde": "cv",
    "Cambodia": "kh",
    "Cameroon": "cm",
    "Canada": "ca",
    "Central African Republic": "cf",
    "Chad": "td",
    "Chile": "cl",
    "China": "cn",
    "Colombia": "co",
    "Comoros": "km",
    "Congo": "cg",
    "Costa Rica": "cr",
    "Croatia": "hr",
    "Cuba": "cu",
    "Cyprus": "cy",
    "Czech Republic": "cz",
    "Democratic Republic of the Congo": "cd",
    "Denmark": "dk",
    "Djibouti": "dj",
    "Dominica": "dm",
    "Dominican Republic": "do",
    "Ecuador": "ec",
    "Egypt": "eg",
    "El Salvador": "sv",
    "Equatorial Guinea": "gq",
    "Eritrea": "er",
    "Estonia": "ee",
    "Eswatini": "sz",
    "Ethiopia": "et",
    "Fiji": "fj",
    "Finland": "fi",
    "France": "fr",
    "Gabon": "ga",
    "Gambia": "gm",
    "Georgia": "ge",
    "Germany": "de",
    "Ghana": "gh",
    "Greece": "gr",
    "Grenada": "gd",
    "Guatemala": "gt",
    "Guinea": "gn",
    "Guinea-Bissau": "gw",
    "Guyana": "gy",
    "Haiti": "ht",
    "Honduras": "hn",
    "Hungary": "hu",
    "Iceland": "is",
    "India": "in",
    "Indonesia": "id",
    "Iran": "ir",
    "Iraq": "iq",
    "Ireland": "ie",
    "Israel": "il",
    "Italy": "it",
    "Jamaica": "jm",
    "Japan": "jp",
    "Jordan": "jo",
    "Kazakhstan": "kz",
    "Kenya": "ke",
    "Kiribati": "ki",
    "Kuwait": "kw",
    "Kyrgyzstan": "kg",
    "Laos": "la",
    "Lao People's Democratic Republic": "la",
    "Latvia": "lv",
    "Lebanon": "lb",
    "Lesotho": "ls",
    "Liberia": "lr",
    "Libya": "ly",
    "Liechtenstein": "li",
    "Lithuania": "lt",
    "Luxembourg": "lu",
    "Madagascar": "mg",
    "Malawi": "mw",
    "Malaysia": "my",
    "Maldives": "mv",
    "Mali": "ml",
    "Malta": "mt",
    "Mauritania": "mr",
    "Mauritius": "mu",
    "Mexico": "mx",
    "Moldova": "md",
    "Monaco": "mc",
    "Mongolia": "mn",
    "Montenegro": "me",
    "Morocco": "ma",
    "Mozambique": "mz",
    "Myanmar": "mm",
    "Namibia": "na",
    "Nauru": "nr",
    "Nepal": "np",
    "Netherlands": "nl",
    "New Zealand": "nz",
    "Nicaragua": "ni",
    "Niger": "ne",
    "Nigeria": "ng",
    "North Korea": "kp",
    "North Macedonia": "mk",
    "Norway": "no",
    "Oman": "om",
    "Pakistan": "pk",
    "Palau": "pw",
    "Panama": "pa",
    "Papua New Guinea": "pg",
    "Paraguay": "py",
    "Peru": "pe",
    "Philippines": "ph",
    "Poland": "pl",
    "Portugal": "pt",
    "Qatar": "qa",
    "Romania": "ro",
    "Russia": "ru",
    "Rwanda": "rw",
    "Saudi Arabia": "sa",
    "Senegal": "sn",
    "Serbia": "rs",
    "Seychelles": "sc",
    "Sierra Leone": "sl",
    "Singapore": "sg",
    "Slovakia": "sk",
    "Slovenia": "si",
    "Solomon Islands": "sb",
    "Somalia": "so",
    "South Africa": "za",
    "South Korea": "kr",
    "Republic Of Korea": "kr",
    "South Sudan": "ss",
    "Spain": "es",
    "Sri Lanka": "lk",
    "Sudan": "sd",
    "Suriname": "sr",
    "Sweden": "se",
    "Switzerland": "ch",
    "Syria": "sy",
    "Tajikistan": "tj",
    "Tanzania": "tz",
    "Thailand": "th",
    "Togo": "tg",
    "Tonga": "to",
    "Trinidad and Tobago": "tt",
    "Tunisia": "tn",
    "Turkey": "tr",
    "Turkmenistan": "tm",
    "Tuvalu": "tv",
    "Uganda": "ug",
    "Ukraine": "ua",
    "United Arab Emirates": "ae",
    "United Kingdom": "gb",
    "United States": "us",
    "Uruguay": "uy",
    "Uzbekistan": "uz",
    "Vanuatu": "vu",
    "Vatican City": "va",
    "Venezuela": "ve",
    "Vietnam": "vn",
    "Yemen": "ye",
    "Zambia": "zm",
    "Zimbabwe": "zw",
    "Taiwan": "tw",
    "Macao": "mo"
  };

  // -------------------------------------------
  // Busca países de 1 ADOM específico
  // -------------------------------------------
  private async fetchCountries(
    fortiweb: FortiwebAdomConfig,
    adom: string,
  ): Promise<{ country: string; count: number }[]> {
    const token = this.generateToken(fortiweb, adom);

    const url = `${fortiweb.baseUrl}/api/v2.0/system/status.monitor?vdom=${adom}&interval=43200`;

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Authorization: token,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        agent: this.httpsAgent,
      });

      if (!response.ok) {
        console.error(`❌ Erro no FortiWeb ${fortiweb.name} [${adom}]:`, response.status);
        return [];
      }

      const body = await response.json();

      return (
        body?.results?.threat_by_countries?.map((item: any) => ({
          country: item.country || 'Desconhecido',
          count: parseInt(item.count, 10) || 0,
        })) || []
      );
    } catch (err) {
      console.error(
        `❌ Erro ao buscar países no FortiWeb ${fortiweb.name} [${adom}]:`,
        err,
      );
      return [];
    }
  }

  // -----------------------------------------------------
  // FUNÇÃO PRINCIPAL → percorre tudo e soma os resultados
  // -----------------------------------------------------
  async getThreatsByCountry(): Promise<
    { country: string; count: number; flag: string }[]
  > {
    const aggregated: Record<string, number> = {};

    for (const fw of this.fortiwebs) {
      for (const adom of fw.adoms) {
        const countries = await this.fetchCountries(fw, adom);

        for (const item of countries) {
          if (!aggregated[item.country]) aggregated[item.country] = 0;
          aggregated[item.country] += item.count;
        }
      }
    }

    return Object.entries(aggregated)
      .map(([country, count]) => {
        const code = this.countryCodeMap[country] || 'unknown';
        const flag = `https://flagcdn.com/w40/${code}.png`;

        return { country, count, flag };
      })
      .sort((a, b) => b.count - a.count); // 🔥 agora está decrescente
  }

}
