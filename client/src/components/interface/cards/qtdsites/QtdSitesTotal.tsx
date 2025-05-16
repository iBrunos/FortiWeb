'use client';

import { useEffect, useState } from 'react';
import { IoIosSettings } from 'react-icons/io';
import { GoTriangleDown } from 'react-icons/go';
import { FaCheck } from 'react-icons/fa';

const intervals = [60000, 300000, 600000, 1800000, 3600000];
const intervalLabels = ["1 Minuto", "5 Minutos", "10 Minutos", "30 Minutos", "1 Hora"];

export default function TotalizadorCRPePH() {
  const [totalSites, setTotalSites] = useState<number | null>(null);
  const [intervalTime, setIntervalTime] = useState<number>(300000);
  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [crpRes, phRes] = await Promise.all([
        fetch("https://fortiwebapi.salvador.ba.gov.br/crp/total"),
        fetch("https://fortiwebapi.salvador.ba.gov.br/ph/total"),
      ]);

      const crpJson = await crpRes.json();
      const phJson = await phRes.json();

      const crpFortiwebs = crpJson.resultados?.fortiwebs || crpJson.fortiwebs || [];
      const phFortiwebs = phJson.fortiwebs || [];

      const crpTotal = crpFortiwebs.reduce((sum: number, fw: any) => sum + fw.total, 0);
      const phTotal = phFortiwebs.reduce((sum: number, fw: any) => sum + fw.total, 0);

      setTotalSites(crpTotal + phTotal);
    } catch (error) {
      console.error("Erro ao buscar os dados:", error);
      setTotalSites(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, intervalTime);
    return () => clearInterval(interval);
  }, [intervalTime]);

  return (
    <div className="relative w-full max-w-md md:max-w-lg lg:max-w-xl mx-auto">
      {/* Card */}
      <div className="relative flex flex-col rounded-3xl bg-slate-800 shadow-sm w-full p-6 md:p-8 my-4 border border-blue-300">
        
        {/* Botão de configuração */}
        <div className="absolute right-6 top-6 z-50">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="text-white bg-slate-900 hover:bg-blue-800 focus:ring-4 rounded-2xl focus:outline-none focus:ring-blue-300 font-medium text-sm px-5 py-2.5 flex items-center gap-1"
          >
            <IoIosSettings className="w-5 h-5" />
            <GoTriangleDown />
          </button>
          {dropdownOpen && (
            <div className="absolute mt-2 bg-gray-800 border-2 divide-y divide-gray-100 rounded-2xl shadow-sm w-44 z-50">
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

        {/* Conteúdo */}
        <div className="pb-6 md:pb-8 mb-6 md:mb-8 text-center text-slate-100 border-b border-slate-600">
          <p className="uppercase font-bold text-4xl text-white">TOTAL DE SITES</p>
          <h1 className="flex justify-center gap-1 mt-4 font-bold text-white text-2xl md:text-4xl">
            {isLoading ? (
              <div className="w-20 h-8 bg-slate-700 animate-pulse rounded" />
            ) : (
              totalSites
            )}
          </h1>
        </div>
      </div>
    </div>
  );
}
