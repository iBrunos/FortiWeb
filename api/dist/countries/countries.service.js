"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CountriesService = void 0;
const common_1 = require("@nestjs/common");
const node_fetch_1 = require("node-fetch");
const https = require("https");
let CountriesService = class CountriesService {
    constructor() {
        this.API_URL = 'https://172.30.1.254/api/v2.0/system/status.monitor?interval=43200';
        this.AUTH_TOKEN = "eyJ1c2VybmFtZSI6ImFwaSIsInBhc3N3b3JkIjoiQXBpQDEyMzQ1NiIsInZkb20iOiJyb290In0K";
        this.countryCodeMap = {
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
    }
    async getThreatsByCountry() {
        try {
            const response = await (0, node_fetch_1.default)(this.API_URL, {
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
                return body.results.threat_by_countries.map((item) => {
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
        }
        catch (error) {
            throw new Error(`Erro ao fazer a requisição: ${error.message}`);
        }
    }
};
exports.CountriesService = CountriesService;
exports.CountriesService = CountriesService = __decorate([
    (0, common_1.Injectable)()
], CountriesService);
//# sourceMappingURL=countries.service.js.map