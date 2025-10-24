"use client";

import { useState, useEffect } from "react";
import { IoIosSettings } from "react-icons/io";
import { GoTriangleDown } from "react-icons/go";
import { FaCheck } from "react-icons/fa";
import { IoClose } from "react-icons/io5";
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

const QtdSitesCRP: React.FC = () => {
  const [fortiwebData, setFortiwebData] = useState<FortiWebData[]>([]);
  const [popupOpen, setPopupOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState<FortiWebData | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [intervalTime, setIntervalTime] = useState<number>(300000);
  const [loading, setLoading] = useState(false);

  const intervals = [60000, 300000, 600000, 1800000, 3600000];
  const intervalLabels = ["1 Minuto", "5 Minutos", "10 Minutos", "30 Minutos", "1 Hora"];
  const API_URL = "https://fortiwebapi.salvador.ba.gov.br/crp/total";
  const MAX_ITEMS = 20; // Limite de 20 itens

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

  const totalCRPs = fortiwebData.reduce((sum, item) => sum + item.total, 0);

  return (
    <div className="flex flex-col bg-gray-800 rounded-2xl relative p-4 md:p-6">
      {/* Cabeçalho */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl md:text-2xl font-bold text-white">Sites via CRP</h2>
        
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

      {/* Card de total geral */}
      <div className="mb-4">
        <div className="flex flex-col rounded-xl md:rounded-2xl bg-gray-800 shadow-sm w-full p-4 border border-blue-500">
          <div className="text-center text-slate-100 border-b border-slate-600 pb-3 mb-3">
            <p className="uppercase font-semibold text-blue-300 text-sm md:text-base">TOTAL DE SITES</p>
            <h1 className="mt-2 font-bold text-white text-xl md:text-2xl">
              {totalCRPs}
            </h1>
          </div>
          <div className="space-y-1 text-slate-300 text-sm">
            {fortiwebData.slice(0, MAX_ITEMS).map((crp, idx) => (
              <div key={idx} className="flex justify-between">
                <span className="truncate mr-2">{crp.name}</span>
                <span className="font-semibold">{crp.total}</span>
              </div>
            ))}
            {/* Mostra contador se houver mais itens */}
            {fortiwebData.length > MAX_ITEMS && (
              <div className="text-center text-slate-400 text-xs pt-2 border-t border-slate-600">
                + {fortiwebData.length - MAX_ITEMS} itens ocultos
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Cards de CRP com duas colunas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-1 gap-4">
        {fortiwebData.slice(0, MAX_ITEMS).map((crp, index) => {
          const sortedAdoms = [...crp.adoms].sort((a, b) => b.total - a.total);
          const displayedAdoms = sortedAdoms.slice(0, MAX_ITEMS); // Limita a 20 ADOMs
          const isClickable = crp.total > 0;

          return (
            <div
              key={index}
              className={`flex flex-col ${
                isClickable ? "hover:bg-slate-600 cursor-pointer" : "opacity-50"
              } rounded-xl md:rounded-2xl bg-gray-800 shadow-sm w-full p-4 border border-slate-600 transition-colors`}
              onClick={() => {
                if (isClickable) {
                  setSelectedCard(crp);
                  setPopupOpen(true);
                }
              }}
            >
              <div className="text-center text-slate-100 border-b border-slate-600 pb-3 mb-3">
                <p className="uppercase font-semibold text-slate-300 text-sm md:text-base">{crp.name}</p>
                <h1 className="mt-2 font-bold text-white text-xl md:text-2xl">
                  {crp.total}
                </h1>
              </div>
              
              {/* Duas colunas com máximo de 20 ADOMs */}
              <div className="grid grid-cols-2 gap-2">
                {displayedAdoms.map((adom, idx) => (
                  <div key={idx} className="flex justify-between items-center p-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors">
                    <span className="text-sm text-slate-200 truncate" title={adom.name}>
                      {adom.name}
                    </span>
                    <span className="text-sm font-bold text-white bg-blue-600 px-2 py-1 rounded-md min-w-12 text-center">
                      {adom.total}
                    </span>
                  </div>
                ))}
              </div>
              
              {/* Mostra contador se houver mais ADOMs */}
              {sortedAdoms.length > MAX_ITEMS && (
                <div className="text-center text-slate-400 text-xs pt-3 mt-2 border-t border-slate-600">
                  + {sortedAdoms.length - MAX_ITEMS} ADOMs ocultos
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Modal com tabela de ADOMs - máximo 20 */}
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
            className="bg-gray-800 p-4 md:p-6 rounded-2xl shadow-lg w-full max-w-4xl"
          >
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="text-lg md:text-xl font-bold text-white">{selectedCard.name}</h3>
                <p className="text-sm text-gray-400">Total: {selectedCard.total} sites</p>
              </div>
              <button 
                onClick={() => setPopupOpen(false)} 
                className="text-xl text-white hover:text-gray-300"
              >
                <IoClose />
              </button>
            </div>
            
            {/* Grid de 2 colunas no modal - máximo 20 itens */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[...selectedCard.adoms]
                .sort((a, b) => b.total - a.total)
                .slice(0, MAX_ITEMS)
                .map((adom, idx) => (
                <div key={idx} className="flex justify-between items-center p-3 bg-gray-700 rounded-lg border border-gray-600">
                  <span className="text-sm md:text-base text-slate-200 font-medium truncate" title={adom.name}>
                    {adom.name}
                  </span>
                  <span className="text-lg font-bold text-blue-300 bg-gray-800 px-3 py-2 rounded-lg min-w-16 text-center">
                    {adom.total}
                  </span>
                </div>
              ))}
            </div>
            
            {/* Mostra contador no modal se houver mais itens */}
            {selectedCard.adoms.length > MAX_ITEMS && (
              <div className="text-center text-slate-400 text-xs pt-4 mt-3 border-t border-gray-600">
                Mostrando {MAX_ITEMS} de {selectedCard.adoms.length} ADOMs
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default QtdSitesCRP;