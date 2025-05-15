"use client";

import { useState, useEffect } from "react";
import { IoClose } from "react-icons/io5";
import { IoIosSettings } from "react-icons/io";
import { GoTriangleDown } from "react-icons/go";
import { FaCheck } from "react-icons/fa";
import { motion } from "framer-motion";

interface AdomData {
  name: string;
  total: number;
}

interface FortiWebData {
  name: string;
  adoms: AdomData[];
  total: number;
}

const QtdSitesPH: React.FC = () => {
  const [fortiwebData, setFortiwebData] = useState<FortiWebData[]>([]);
  const [popupOpen, setPopupOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState<FortiWebData | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [intervalTime, setIntervalTime] = useState<number>(300000); // 5 min default
  const [loading, setLoading] = useState(false);

  const intervals = [60000, 300000, 600000, 1800000, 3600000];
  const intervalLabels = ["1 Minuto", "5 Minutos", "10 Minutos", "30 Minutos", "1 Hora"];

  const API_URL = "https://fortiwebapi.salvador.ba.gov.br/ph/total";

  const fetchFortiwebData = async () => {
    setLoading(true);
    try {
      const response = await fetch(API_URL);
      const result = await response.json();
      setFortiwebData(result.fortiwebs || []);
    } catch (error) {
      console.error("Erro ao buscar dados do FortiWeb:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFortiwebData();
    const intervalId = setInterval(fetchFortiwebData, intervalTime);
    return () => clearInterval(intervalId);
  }, [intervalTime]);

  const totalPHs = fortiwebData.reduce((sum, item) => sum + item.total, 0);

  const processAdoms = (adoms: AdomData[]) => {
    const sorted = [...adoms].sort((a, b) => b.total - a.total);
    const top10 = sorted.slice(0, 5);
    const othersTotal = sorted.slice(5).reduce((sum, a) => sum + a.total, 0);
    return othersTotal > 0 ? [...top10, { name: "Outros", total: othersTotal }] : top10;
  };

  return (
    <div className="flex flex-col items-center bg-gray-900 rounded-2xl relative p-6">
      <h2 className="text-2xl font-bold text-center mt-2 mb-4 text-white">Sites via PH</h2>

      {/* Configuração de intervalo */}
      <div className="absolute right-4 top-4">
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
                    className="block px-4 py-2 w-full text-left hover:bg-gray-100 hover:text-black dark:hover:bg-gray-600 dark:hover:text-white flex items-center justify-between"
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

      {/* Loading */}
      {loading && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}

      {/* Cards de PH */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6 w-full justify-items-center">
        {fortiwebData.map((ph, index) => {
          const processedAdoms = processAdoms(ph.adoms);
          const isClickable = ph.total > 0;

          return (
            <div
              key={index}
              className={`flex flex-col ${isClickable ? "hover:bg-slate-600 cursor-pointer" : "opacity-50"} rounded-3xl bg-slate-800 shadow-sm w-full md:max-w-xs p-6 md:p-8 my-4 border border-slate-600`}
              onClick={() => {
                if (isClickable) {
                  setSelectedCard({ ...ph, adoms: processedAdoms });
                  setPopupOpen(true);
                }
              }}
            >
              <div className="pb-6 md:pb-8 mb-6 md:mb-8 text-center text-slate-100 border-b border-slate-600">
                <p className="uppercase font-semibold text-slate-300">{ph.name}</p>
                <h1 className="flex justify-center gap-1 mt-4 font-bold text-white text-2xl md:text-4xl">
                  {ph.total}
                </h1>
              </div>
              <div className="space-y-2 mt-4 text-slate-300">
                {processedAdoms.map((adom, idx) => (
                  <div key={idx} className="flex justify-between">
                    <span>{adom.name}</span>
                    <span>{adom.total}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        {/* Card de total geral */}
        <div className="flex flex-col rounded-3xl bg-slate-800 shadow-sm w-full md:max-w-xs p-6 md:p-8 my-4 border border-blue-500">
          <div className="pb-6 md:pb-8 mb-6 md:mb-8 text-center text-slate-100 border-b border-slate-600">
            <p className="uppercase font-semibold text-blue-300">TOTAL DE SITES</p>
            <h1 className="flex justify-center gap-1 mt-4 font-bold text-white text-2xl md:text-4xl">
              {totalPHs}
            </h1>
          </div>
          <div className="space-y-2 mt-4 text-slate-300">
            {fortiwebData.map((ph, idx) => (
              <div key={idx} className="flex justify-between">
                <span>{ph.name}</span>
                <span>{ph.total}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal com tabela de ADOMs */}
      {popupOpen && selectedCard && (
        <motion.div
          initial={{ x: "-100%" }}
          animate={{ x: 0 }}
          exit={{ x: "-100%" }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
        >
          <div className="bg-gray-800 p-6 rounded-2xl shadow-lg w-full max-w-5xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-white">{selectedCard.name}</h3>
              <button onClick={() => setPopupOpen(false)} className="text-xl text-white">
                <IoClose />
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left text-slate-300">
                <thead className="text-xs uppercase bg-gray-700 text-gray-300">
                  <tr>
                    <th className="px-6 py-3">ADOM</th>
                    <th className="px-6 py-3 text-right">Quantidade</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedCard.adoms.map((adom, idx) => (
                    <tr key={idx} className="border-b border-slate-600 bg-slate-800 hover:bg-slate-700">
                      <td className="px-6 py-4">{adom.name}</td>
                      <td className="px-6 py-4 text-right font-semibold">{adom.total}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default QtdSitesPH;
