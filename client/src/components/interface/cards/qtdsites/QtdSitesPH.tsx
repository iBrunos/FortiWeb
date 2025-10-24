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
  const [intervalTime, setIntervalTime] = useState<number>(300000);
  const [loading, setLoading] = useState(false);

  const intervals = [60000, 300000, 600000, 1800000, 3600000];
  const intervalLabels = ["1 Minuto", "5 Minutos", "10 Minutos", "30 Minutos", "1 Hora"];
  const API_URL = "https://fortiwebapi.salvador.ba.gov.br/ph/total";

  const fetchFortiwebData = async () => {
    setLoading(true);
    try {
      const response = await fetch(API_URL);
      const result = await response.json();
      const data: FortiWebData[] = result.resultados.fortiwebs || [];
      
      const aggregated: Record<string, FortiWebData> = {};

      data.forEach(item => {
        const key = item.name.toLowerCase();
        if (!aggregated[key]) {
          aggregated[key] = { ...item, adoms: [...item.adoms] };
        } else {
          aggregated[key].total += item.total;
          item.adoms.forEach(adom => {
            const existing = aggregated[key].adoms.find(a => a.name === adom.name);
            if (existing) {
              existing.total += adom.total;
            } else {
              aggregated[key].adoms.push({ ...adom });
            }
          });
        }
      });

      setFortiwebData(Object.values(aggregated));
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
    const top5 = sorted.slice(0, 5);
    const othersTotal = sorted.slice(5).reduce((sum, a) => sum + a.total, 0);
    return othersTotal > 0 ? [...top5, { name: "Outros", total: othersTotal }] : top5;
  };

  return (
    <div className="flex flex-col bg-gray-800 rounded-2xl relative p-4 md:p-6">
      {/* Cabeçalho */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl md:text-2xl font-bold text-white">Sites via PH</h2>
        
        {/* Configuração de intervalo */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="text-white bg-slate-900 hover:bg-blue-800 focus:ring-4 rounded-2xl focus:outline-none focus:ring-blue-300 font-medium text-sm px-4 py-2.5 flex items-center gap-1"
          >
            <IoIosSettings className="w-4 h-4" />
            <GoTriangleDown className="w-3 h-3" />
          </button>
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 bg-gray-800 border-2 divide-y divide-gray-100 rounded-2xl shadow-sm w-40 z-50">
              <ul className="py-2 text-sm text-white">
                {intervals.map((time, index) => (
                  <li key={index}>
                    <button
                      onClick={() => {
                        setIntervalTime(time);
                        setDropdownOpen(false);
                      }}
                      className="block px-3 py-2 w-full text-left hover:bg-gray-100 hover:text-black flex items-center justify-between text-xs"
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

      {/* Loading */}
      {loading && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10 rounded-2xl">
          <div className="animate-spin rounded-full h-8 w-8 md:h-12 md:w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}

      {/* Cards de PH */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-1 gap-4">
        {fortiwebData.map((ph, index) => {
          const processedAdoms = processAdoms(ph.adoms);
          const isClickable = ph.total > 0;

          return (
            <div
              key={index}
              className={`flex flex-col ${
                isClickable ? "hover:bg-slate-600 cursor-pointer" : "opacity-50"
              } rounded-xl md:rounded-2xl bg-slate-700 shadow-sm w-full p-4 border border-slate-600 transition-colors`}
              onClick={() => {
                if (isClickable) {
                  setSelectedCard({ ...ph, adoms: processedAdoms });
                  setPopupOpen(true);
                }
              }}
            >
              <div className="text-center text-slate-100 border-b border-slate-600 pb-3 mb-3">
                <p className="uppercase font-semibold text-slate-300 text-sm md:text-base">{ph.name}</p>
                <h1 className="mt-2 font-bold text-white text-xl md:text-2xl">
                  {ph.total}
                </h1>
              </div>
              <div className="space-y-1 text-slate-300 text-sm">
                {processedAdoms.map((adom, idx) => (
                  <div key={idx} className="flex justify-between">
                    <span className="truncate mr-2">{adom.name}</span>
                    <span className="font-semibold">{adom.total}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        {/* Card de total geral */}
        <div className="flex flex-col rounded-xl md:rounded-2xl bg-slate-700 shadow-sm w-full p-4 border border-blue-500">
          <div className="text-center text-slate-100 border-b border-slate-600 pb-3 mb-3">
            <p className="uppercase font-semibold text-blue-300 text-sm md:text-base">TOTAL</p>
            <h1 className="mt-2 font-bold text-white text-xl md:text-2xl">
              {totalPHs}
            </h1>
          </div>
          <div className="space-y-1 text-slate-300 text-sm">
            {fortiwebData.map((ph, idx) => (
              <div key={idx} className="flex justify-between">
                <span className="truncate mr-2">{ph.name}</span>
                <span className="font-semibold">{ph.total}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal com tabela de ADOMs */}
      {popupOpen && selectedCard && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-gray-800 p-4 md:p-6 rounded-2xl shadow-lg w-full max-w-2xl max-h-[80vh] overflow-hidden"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg md:text-xl font-bold text-white">{selectedCard.name}</h3>
              <button 
                onClick={() => setPopupOpen(false)} 
                className="text-xl text-white hover:text-gray-300"
              >
                <IoClose />
              </button>
            </div>
            <div className="overflow-auto max-h-[60vh]">
              <table className="w-full text-sm text-left text-slate-300">
                <thead className="text-xs uppercase bg-gray-700 text-gray-300 sticky top-0">
                  <tr>
                    <th className="px-4 py-2 md:px-6 md:py-3">ADOM</th>
                    <th className="px-4 py-2 md:px-6 md:py-3 text-right">Quantidade</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedCard.adoms.map((adom, idx) => (
                    <tr key={idx} className="border-b border-slate-600 bg-slate-800 hover:bg-slate-700">
                      <td className="px-4 py-2 md:px-6 md:py-4">{adom.name}</td>
                      <td className="px-4 py-2 md:px-6 md:py-4 text-right font-semibold">{adom.total}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default QtdSitesPH;