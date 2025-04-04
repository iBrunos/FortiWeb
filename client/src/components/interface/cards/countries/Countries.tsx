"use client";

import { useState, useEffect } from "react";
import { GoTriangleDown, GoTriangleRight, GoTriangleLeft } from "react-icons/go";
import { FaHouseLaptop } from "react-icons/fa6";
import { IoIosSettings } from "react-icons/io";

interface CountryThreat {
  country: string;
  count: number;
  flag: string;
}

const CountriesTable: React.FC = () => {
  const [countryData, setCountryData] = useState<CountryThreat[]>([]);
  const [intervalTime, setIntervalTime] = useState(10000);
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const API_URL_COUNTRIES = "https://fortiwebapi.salvador.ba.gov.br/countries/list";

  const fetchData = async () => {
    try {
      const response = await fetch(API_URL_COUNTRIES);
      const data = await response.json();
      setCountryData(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
      setCountryData([]);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, intervalTime);
    return () => clearInterval(interval);
  }, [intervalTime]);

  const intervals = [10000, 30000, 60000, 300000, 3600000];
  const intervalLabels = ["10 Segundos", "30 Segundos", "1 Minuto", "5 Minutos", "1 Hora"];

  const totalPages = Math.ceil(countryData.length / itemsPerPage);
  const paginatedData = countryData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="flex flex-col p-4 bg-gray-900 rounded-2xl text-white items-center w-full px-4">
      {/* Dropdown de atualização */}
      <h2 className="text-2xl font-bold text-center mb-">Origens dos ataques</h2>
      <h2 className="text-center mb-4">(últimas 12 horas)</h2>
      <div className="self-end mb-4 relative right-1 bottom-[4rem]">
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="text-white bg-slate-900 rounded-2xl hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium text-sm px-5 py-2.5 flex items-center gap-1"
        >
          <IoIosSettings />
          <GoTriangleDown />
        </button>
        {dropdownOpen && (
          <div className="absolute right-0 mt-2 z-10 bg-gray-800 divide-y divide-gray-100 rounded-2xl border-2 shadow-md w-44 dark:bg-gray-700">
            <ul className="py-2 text-sm text-white dark:text-gray-200">
              {intervals.map((time, index) => (
                <li key={index}>
                  <button
                    onClick={() => {
                      setIntervalTime(time);
                      setDropdownOpen(false);
                    }}
                    className="block px-4 py-2 w-full text-left hover:bg-gray-100 hover:text-black dark:hover:bg-gray-600 dark:hover:text-white"
                  >
                    {intervalLabels[index]}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Tabela responsiva */}
      <div className="w-full overflow-x-auto rounded-lg shadow-lg">
        <table className="w-full text-sm text-left text-gray-400">
          <thead className="text-xs uppercase bg-gray-700 text-gray-300">
            <tr>
              <th className="px-6 py-3">País</th>
              <th className="px-6 py-3 text-right">Quantidade</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((country, index) => (
              <tr key={index} className="border-b border-gray-600 bg-gray-800 hover:bg-gray-700 transition">
                <td className="px-6 py-4 flex items-center gap-2">
                  {country.country.toLowerCase() === "reserved" ? (
                    <FaHouseLaptop className="w-6 h-6 text-gray-400" />
                  ) : (
                    <img src={country.flag} alt={country.country} className="w-6 h-4 rounded shadow-sm" />
                  )}
                  {country.country}
                </td>
                <td className="px-6 py-4 text-right font-semibold">{country.count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Paginação */}
      <div className="flex justify-center mt-4 space-x-2">
        <button
          title="Anterior"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50 flex items-center gap-2"
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          <GoTriangleLeft />
        </button>
        <span className="px-4 py-2 bg-gray-700 rounded-lg">{currentPage} de {totalPages}</span>
        <button
          title="Próxima"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50 flex items-center gap-2"
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
        >
          <GoTriangleRight />
        </button>
      </div>
    </div>
  );
};

export default CountriesTable;