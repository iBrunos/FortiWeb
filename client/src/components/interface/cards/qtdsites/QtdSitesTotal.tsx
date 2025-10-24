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
      const phFortiwebs = phJson.resultados?.fortiwebs || phJson.fortiwebs || [];

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
    <div className="relative w-full">
      {/* Card */}
      <div className="relative flex flex-col rounded-2xl bg-slate-800 shadow-sm w-full p-6 border border-blue-400">
        
        {/* Botão de configuração */}
        <div className="absolute right-4 top-4 z-50">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="text-white bg-slate-900 hover:bg-blue-800 focus:ring-4 rounded-2xl focus:outline-none focus:ring-blue-300 font-medium text-sm px-4 py-2.5 flex items-center gap-1"
          >
            <IoIosSettings className="w-4 h-4" />
            <GoTriangleDown className="w-3 h-3" />
          </button>
          {dropdownOpen && (
            <div className="absolute mt-2 bg-gray-800 border-2 divide-y divide-gray-100 rounded-2xl shadow-sm w-40 z-50">
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

        {/* Conteúdo */}
        <div className="text-center text-slate-100">
          <p className="uppercase font-bold text-white text-lg md:text-xl lg:text-2xl">
            TOTAL DE SITES
          </p>
          <h1 className="flex justify-center gap-1 mt-4 font-bold text-white text-3xl md:text-4xl lg:text-5xl">
            {isLoading ? (
              <div className="w-24 h-8 md:w-32 md:h-10 bg-slate-700 animate-pulse rounded" />
            ) : (
              totalSites
            )}
          </h1>
        </div>
      </div>
    </div>
  );
}