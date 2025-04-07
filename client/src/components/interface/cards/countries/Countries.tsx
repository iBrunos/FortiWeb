"use client";

import { useState, useEffect } from "react";
import { GoTriangleDown, GoTriangleRight, GoTriangleLeft } from "react-icons/go";
import { FaHouseLaptop } from "react-icons/fa6";
import { IoIosSettings } from "react-icons/io";
import { FaCheck } from "react-icons/fa";

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
  const [loading, setLoading] = useState(true);
  const itemsPerPage = 10;

  const API_URL_COUNTRIES = "https://fortiwebapi.salvador.ba.gov.br/countries/list";

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch(API_URL_COUNTRIES);
      const data = await response.json();
      setCountryData(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
      setCountryData([]);
    } finally {
      setLoading(false);
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
    <div className="flex flex-col p-4 bg-gray-900 rounded-2xl text-white items-center w-full px-4 relative">
      {/* Cabeçalho */}
      <h2 className="text-2xl font-bold text-center mb-">Origens dos ataques</h2>
      <h2 className="text-center mb-4">(últimas 12 horas)</h2>

      {/* Dropdown de atualização */}
      <div className="self-end mb-4 absolute top-4 right-4">
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="text-white bg-slate-900 rounded-2xl hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium text-sm px-5 py-2.5 flex items-center gap-1"
        >
          <IoIosSettings className="w-5 h-5" />
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
                    className=" px-4 py-2 w-full text-left hover:bg-gray-100 hover:text-black dark:hover:bg-gray-600 dark:hover:text-white flex items-center justify-between"
                  >
                    <span>{intervalLabels[index]}</span>
                    {intervalTime === time && <FaCheck className="text-green-400 ml-2" />}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Tabela / Skeleton */}
      <div className="w-full overflow-x-auto rounded-lg shadow-lg">
        <table className="w-full text-sm text-left text-gray-400">
          <thead className="text-xs uppercase bg-gray-700 text-gray-300">
            <tr>
              <th className="px-6 py-3">País</th>
              <th className="px-6 py-3 text-right">Quantidade</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              [...Array(itemsPerPage)].map((_, i) => (
                <tr key={i} className="border-b border-gray-600 bg-gray-800 animate-pulse">
                  <td className="px-6 py-4 flex items-center gap-2">
                    <div className="w-6 h-4 bg-gray-700 rounded shadow-sm" />
                    <div className="h-4 bg-gray-700 rounded w-32" />
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="h-4 bg-gray-700 rounded w-12 ml-auto" />
                  </td>
                </tr>
              ))
            ) : (
              paginatedData.map((country, index) => (
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
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Paginação / Skeleton */}
      <div className="flex justify-center mt-4 space-x-2">
        {loading ? (
          <div className="flex gap-4 animate-pulse">
            <div className="w-10 h-10 bg-gray-700 rounded-lg" />
            <div className="w-24 h-10 bg-gray-700 rounded-lg" />
            <div className="w-10 h-10 bg-gray-700 rounded-lg" />
          </div>
        ) : (
          <>
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
          </>
        )}
      </div>
    </div>
  );
};

export default CountriesTable;
