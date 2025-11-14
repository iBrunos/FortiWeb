"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CountriesService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const node_fetch_1 = require("node-fetch");
const https = require("https");
let CountriesService = class CountriesService {
    constructor(configService) {
        this.configService = configService;
        this.httpsAgent = new https.Agent({ rejectUnauthorized: false });
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
        this.fortiwebs = [1, 2, 3, 4]
            .map((index) => {
            var _a;
            const name = this.configService.get(`FORTIWEB${index}_NAME`);
            const baseUrl = this.configService.get(`FORTIWEB${index}_URL`);
            const username = this.configService.get(`FORTIWEB${index}_USER`);
            const password = this.configService.get(`FORTIWEB${index}_PASS`);
            const adoms = ((_a = this.configService.get(`FORTIWEB${index}_ADOMS`)) === null || _a === void 0 ? void 0 : _a.split(',')) ||
                [];
            if (name && baseUrl && username && password && adoms.length) {
                return { name, baseUrl, username, password, adoms };
            }
            return null;
        })
            .filter((f) => f !== null);
    }
    generateToken(fortiweb, adom) {
        return Buffer.from(JSON.stringify({
            username: fortiweb.username,
            password: fortiweb.password,
            vdom: adom,
        })).toString('base64');
    }
    async fetchCountries(fortiweb, adom) {
        var _a, _b;
        const token = this.generateToken(fortiweb, adom);
        const url = `${fortiweb.baseUrl}/api/v2.0/system/status.monitor?vdom=${adom}&interval=43200`;
        try {
            const response = await (0, node_fetch_1.default)(url, {
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
            return (((_b = (_a = body === null || body === void 0 ? void 0 : body.results) === null || _a === void 0 ? void 0 : _a.threat_by_countries) === null || _b === void 0 ? void 0 : _b.map((item) => ({
                country: item.country || 'Desconhecido',
                count: parseInt(item.count, 10) || 0,
            }))) || []);
        }
        catch (err) {
            console.error(`❌ Erro ao buscar países no FortiWeb ${fortiweb.name} [${adom}]:`, err);
            return [];
        }
    }
    async getThreatsByCountry() {
        const aggregated = {};
        for (const fw of this.fortiwebs) {
            for (const adom of fw.adoms) {
                const countries = await this.fetchCountries(fw, adom);
                for (const item of countries) {
                    if (!aggregated[item.country])
                        aggregated[item.country] = 0;
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
            .sort((a, b) => b.count - a.count);
    }
};
exports.CountriesService = CountriesService;
exports.CountriesService = CountriesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], CountriesService);
//# sourceMappingURL=countries.service.js.map