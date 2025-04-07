"use client";

import { useState, useEffect } from "react";
import { RxUpdate } from "react-icons/rx";
import { GoTriangleDown, GoTriangleLeft, GoTriangleRight } from "react-icons/go";
import { IoClose } from "react-icons/io5";
import { motion } from "framer-motion";
import { IoIosSettings } from "react-icons/io";

interface SiteData {
  crp: string;
  matchExpressions: string[];
}

const QtdSites: React.FC = () => {
  const [totalCRP, setTotalCRP] = useState<number | null>(null);
  const [totalPH, setTotalPH] = useState<number | null>(null);
  const [intervalTime, setIntervalTime] = useState(3600000);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [popupOpen, setPopupOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  const [siteData, setSiteData] = useState<SiteData[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalSites, setTotalSites] = useState(0);
  const [isLoadingSites, setIsLoadingSites] = useState(false); // 🔽 novo estado

  const API_URL_CR = "https://fortiwebapi.salvador.ba.gov.br/crp/total";
  const API_URL_PH = "https://fortiwebapi.salvador.ba.gov.br/ph/total";
  const API_URL_SITES = "http://localhost:3002/crp/expressions";
  const SITES_PER_PAGE = 15;

  const fetchData = async () => {
    try {
      const [resCRP, resPH] = await Promise.all([
        fetch(API_URL_CR),
        fetch(API_URL_PH),
      ]);

      const [dataCRP, dataPH] = await Promise.all([
        resCRP.json(),
        resPH.json(),
      ]);

      setTotalCRP(dataCRP.total);
      setTotalPH(dataPH.total);
    } catch (error) {
      console.error("Erro ao buscar CRP/PH:", error);
    }
  };

  const fetchSitesByPage = async (page: number) => {
    try {
      setIsLoadingSites(true); // 🔽 começa carregamento
      const response = await fetch(`${API_URL_SITES}?page=${page}&limit=${SITES_PER_PAGE}`);
      const result = await response.json();
      setSiteData(result.data);
      setTotalSites(result.total);
    } catch (error) {
      console.error("Erro ao buscar dados dos sites:", error);
    } finally {
      setIsLoadingSites(false); // 🔽 termina carregamento
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, intervalTime);
    return () => clearInterval(interval);
  }, [intervalTime]);

  useEffect(() => {
    if (popupOpen && selectedCard === "Via CRP") {
      fetchSitesByPage(currentPage);
    }
  }, [currentPage, popupOpen, selectedCard]);

  const intervals = [60000, 300000, 600000, 1800000, 3600000];
  const intervalLabels = ["1 Minuto", "5 Minutos", "10 Minutos", "30 Minutos", "1 Hora"];

  const totalPages = Math.ceil(totalSites / SITES_PER_PAGE);

  return (
    <div className="flex flex-col items-center bg-gray-900 rounded-2xl relative">
      <h2 className="text-2xl font-bold text-center mt-2 mb-4">Quantitativo de Sites</h2>

      <div className="absolute right-1 bottom-[17rem]">
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="text-white bg-slate-900 hover:bg-blue-800 focus:ring-4 rounded-2xl focus:outline-none focus:ring-blue-300 font-medium text-sm px-5 py-2.5 flex items-center gap-1"
        >
          <IoIosSettings className="w-5 h-5" />
          <GoTriangleDown />
        </button>
        {dropdownOpen && (
          <div className="absolute right-0 mt-2 bg-gray-800 border-2 divide-y divide-gray-100 rounded-2xl shadow-sm w-44 z-50">
            <ul className="py-2 text-sm text-white">
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {[
          { title: "Via CRP", value: totalCRP },
          { title: "Via PH", value: totalPH },
          {
            title: "Total",
            value: totalPH !== null && totalCRP !== null ? totalPH + totalCRP : null,
          },
        ].map((item, index) => (
          <div
            key={index}
            className={`flex flex-col ${item.value !== null ? "hover:bg-slate-600 cursor-pointer" : ""
              } rounded-3xl bg-slate-800 shadow-sm w-full md:max-w-xs p-6 md:p-8 my-4 border border-slate-600`}
            onClick={() => {
              if (item.value !== null) {
                setSelectedCard(item.title);
                setPopupOpen(true);
                setCurrentPage(1);
                if (item.title === "Via CRP") {
                  fetchSitesByPage(1);
                }
              }
            }}
          >
            <div className="pb-6 md:pb-8 m-0 mb-6 md:mb-8 text-center text-slate-100 border-b border-slate-600">
              <p className="uppercase font-semibold text-slate-300">{item.title}</p>
              {item.value !== null ? (
                <h1 className="flex justify-center gap-1 mt-4 font-bold text-white text-2xl md:text-4xl">
                  {item.value}
                </h1>
              ) : (
                <div className="mt-4 flex justify-center">
                  <div className="h-10 w-24 bg-gray-600 rounded animate-pulse" />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>


      {popupOpen && selectedCard === "Via CRP" && (
        <motion.div
          initial={{ x: "-100%" }}
          animate={{ x: 0 }}
          exit={{ x: "-100%" }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
        >
          <div className="bg-gray-800 p-6 rounded-2xl shadow-lg w-full max-w-5xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-white">{selectedCard}</h3>
              <button onClick={() => setPopupOpen(false)} className="text-xl text-white">
                <IoClose />
              </button>
            </div>
            <table className="w-full border-collapse border border-gray-600 text-white text-sm sm:text-base">
              <thead>
                <tr className="bg-gray-700">
                  <th className="border border-gray-600 p-2">ID</th>
                  <th className="border border-gray-600 p-2">CRP</th>
                  <th className="border border-gray-600 p-2">Match Expressions</th>
                </tr>
              </thead>
              <tbody>
                {isLoadingSites
                  ? Array.from({ length: SITES_PER_PAGE }).map((_, i) => (
                    <tr key={i} className="animate-pulse bg-gray-800">
                      <td className="border border-gray-600 p-2">
                        <div className="h-4 bg-gray-600 rounded w-3/4 mx-auto" />
                      </td>
                      <td className="border border-gray-600 p-2">
                        <div className="h-4 bg-gray-600 rounded w-4/5 mx-auto" />
                      </td>
                      <td className="border border-gray-600 p-2">
                        <div className="h-4 bg-gray-600 rounded w-full" />
                      </td>
                    </tr>
                  ))
                  : siteData.map((site, index) => (
                    <tr key={index} className="text-center bg-gray-800 hover:bg-gray-700">
                      <td className="border border-gray-600 p-2">
                        {(currentPage - 1) * SITES_PER_PAGE + index + 1}
                      </td>
                      <td className="border border-gray-600 p-2">{site.crp}</td>
                      <td className="border border-gray-600 p-2">
                        {site.matchExpressions.join(", ")}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>

            {totalPages > 1 && (
              <div className="flex justify-center mt-4 space-x-2">
                <button
                  title="Anterior"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50 flex items-center gap-2"
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                >
                  <GoTriangleLeft />
                </button>
                <span className="px-4 py-2 bg-gray-700 rounded-lg">
                  {currentPage} de {totalPages}
                </span>
                <button
                  title="Próxima"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50 flex items-center gap-2"
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                >
                  <GoTriangleRight />
                </button>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default QtdSites;