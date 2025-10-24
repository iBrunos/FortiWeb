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
  const [intervalTime, setIntervalTime] = useState(300000);
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const itemsPerPage = 8;

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
    <div className="flex flex-col p-4 bg-gray-800 rounded-2xl text-white w-full relative">
      {/* Cabeçalho */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-xl md:text-2xl font-bold">Origens dos ataques</h2>
          <p className="text-sm text-gray-400">(últimas 12 horas)</p>
        </div>

        {/* Dropdown de atualização */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="text-white bg-slate-900 rounded-2xl hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium text-sm px-4 py-2.5 flex items-center gap-1"
          >
            <IoIosSettings className="w-4 h-4" />
            <GoTriangleDown className="w-3 h-3" />
          </button>
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 z-10 bg-gray-800 divide-y divide-gray-100 rounded-2xl border-2 shadow-md w-40">
              <ul className="py-2 text-sm text-white">
                {intervals.map((time, index) => (
                  <li key={index}>
                    <button
                      onClick={() => {
                        setIntervalTime(time);
                        setDropdownOpen(false);
                      }}
                      className="px-3 py-2 w-full text-left hover:bg-gray-100 hover:text-black flex items-center justify-between text-xs"
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
      </div>

      {/* Tabela */}
      <div className="w-full overflow-x-auto rounded-lg shadow-lg">
        <table className="w-full text-sm text-left text-gray-400">
          <thead className="text-xs uppercase bg-gray-700 text-gray-300">
            <tr>
              <th className="px-3 py-2 md:px-6 md:py-3">País</th>
              <th className="px-3 py-2 md:px-6 md:py-3 text-right">Quantidade</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              [...Array(itemsPerPage)].map((_, i) => (
                <tr key={i} className="border-b border-gray-600 bg-gray-800 animate-pulse">
                  <td className="px-3 py-3 md:px-6 md:py-4 flex items-center gap-2">
                    <div className="w-6 h-4 bg-gray-700 rounded shadow-sm" />
                    <div className="h-4 bg-gray-700 rounded w-20 md:w-32" />
                  </td>
                  <td className="px-3 py-3 md:px-6 md:py-4 text-right">
                    <div className="h-4 bg-gray-700 rounded w-8 md:w-12 ml-auto" />
                  </td>
                </tr>
              ))
            ) : (
              paginatedData.map((country, index) => (
                <tr key={index} className="border-b border-gray-600 bg-gray-800 hover:bg-gray-700 transition">
                  <td className="px-3 py-3 md:px-6 md:py-4 flex items-center gap-2">
                    {country.country.toLowerCase() === "reserved" ? (
                      <FaHouseLaptop className="w-5 h-5 md:w-6 md:h-6 text-gray-400" />
                    ) : (
                      <img 
                        src={country.flag} 
                        alt={country.country} 
                        className="w-5 h-3 md:w-6 md:h-4 rounded shadow-sm" 
                      />
                    )}
                    <span className="truncate">{country.country}</span>
                  </td>
                  <td className="px-3 py-3 md:px-6 md:py-4 text-right font-semibold">{country.count}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Paginação */}
      <div className="flex justify-between items-center mt-4">
        <span className="text-sm text-gray-400">
          Página {currentPage} de {totalPages}
        </span>
        
        <div className="flex gap-2">
          <button
            title="Anterior"
            className="p-2 bg-blue-600 text-white rounded-lg disabled:opacity-50 flex items-center"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            <GoTriangleLeft className="w-4 h-4" />
          </button>
          <button
            title="Próxima"
            className="p-2 bg-blue-600 text-white rounded-lg disabled:opacity-50 flex items-center"
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            <GoTriangleRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CountriesTable;