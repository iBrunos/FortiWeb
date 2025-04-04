"use client";

import { useState, useEffect } from "react";
import { RxUpdate } from "react-icons/rx";
import { GoTriangleDown } from "react-icons/go";
import Image from "next/image";

const QtdSites: React.FC = () => {
  const [totalCRP, setTotalCRP] = useState<number | null>(null);
  const [totalPH, setTotalPH] = useState<number | null>(null);
  const [totalSites, setTotalSites] = useState<number | null>(null);
  const [intervalTime, setIntervalTime] = useState(3600000);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const API_URL_CR = "https://fortiwebapi.salvador.ba.gov.br/crp/total";
  const API_URL_PH = "https://fortiwebapi.salvador.ba.gov.br/ph/total";

  const fetchData = async () => {
    try {
      const responseCRP = await fetch(API_URL_CR);
      const dataCRP = await responseCRP.json();
      setTotalCRP(dataCRP.total);

      const responsePH = await fetch(API_URL_PH);
      const dataPH = await responsePH.json();
      setTotalPH(dataPH.total);
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, intervalTime);
    return () => clearInterval(interval);
  }, [intervalTime]);

  const intervals = [60000, 300000, 600000, 1800000, 3600000];
  const intervalLabels = ["1 Minuto", "5 Minutos", "10 Minutos", "30 Minutos", "1 Hora"];

  return (
    <div className="flex flex-col items-center relative">
      {/* Dropdown de atualização */}
      
      <h2 className="text-2xl font-bold text-center mb-4">Quatitativo de Sites</h2>
      <div className="absolute right-1 bottom-[20rem]">
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="text-white bg-slate-900 hover:bg-blue-800 focus:ring-4 rounded-2xl focus:outline-none focus:ring-blue-300 font-medium  text-sm px-5 py-2.5 flex items-center gap-1"
        >
          Atualizar: {intervalLabels[intervals.indexOf(intervalTime)]}
          <GoTriangleDown />
        </button>
        {dropdownOpen && (
          <div className="absolute right-0 mt-2 bg-gray-800 border-2 divide-y divide-gray-100 rounded-2xl  shadow-sm w-44 dark:bg-gray-700">
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

      {/* Cards de dados */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6 ">
        {[ 
          { title: "Via CRP", value: totalCRP },
          { title: "Via PH", value: totalPH },
          { title: "Total", value: totalPH !== null && totalCRP !== null ? totalPH + totalCRP : "N/A" }
        ].map((item, index) => (
          <div key={index} className="flex flex-col rounded-3xl bg-slate-800 shadow-sm w-full md:max-w-xs p-6 md:p-8 my-4 border border-slate-600">
            <div className="pb-6 md:pb-8 m-0 mb-6 md:mb-8 text-center text-slate-100 border-b border-slate-600">
              <p className="text-lg md:text-2xl uppercase font-semibold text-slate-300">{item.title}</p>
              <h1 className="flex justify-center gap-1 mt-4 font-bold text-white text-4xl md:text-6xl">
                {item.value !== null ? item.value : "N/A"}
              </h1>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QtdSites;