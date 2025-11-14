"use client";

import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { GoTriangleDown } from "react-icons/go";
import { IoIosSettings } from "react-icons/io";
import { FaCheck } from "react-icons/fa";

interface AttackType {
  type: string;
  count: number;
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A28DFF", "#FF6699"];

export default function AttackType() {
  const [data, setData] = useState<AttackType[]>([]);
  const [loading, setLoading] = useState(true);
  const [intervalTime, setIntervalTime] = useState(10000);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const fetchData = () => {
    fetch("https://fortiwebapi.salvador.ba.gov.br/attacktype/list")
      .then((res) => res.json())
      .then((result) => {
        setData(result);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Erro ao buscar os dados:", error);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, intervalTime);
    return () => clearInterval(interval);
  }, [intervalTime]);

  const intervals = [10000, 30000, 60000, 300000, 3600000];
  const intervalLabels = ["10 Segundos", "30 Segundos", "1 Minuto", "5 Minutos", "1 Hora"];

  return (
    <div className="p-4 md:p-6 bg-gray-800 text-white rounded-2xl shadow-lg w-full relative">
      {/* Cabeçalho e Dropdown */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl md:text-2xl font-bold">Ataques por Tipo</h2>

        {/* Dropdown de atualização */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="text-white bg-slate-900 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-2xl text-sm px-4 py-2.5 flex items-center gap-1"
          >
            <IoIosSettings className="w-4 h-4 md:w-5 md:h-5" />
            <GoTriangleDown className="w-3 h-3" />
          </button>
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 z-10 bg-gray-800 divide-y divide-gray-100 rounded-2xl border-2 shadow-sm w-44">
              <ul className="py-2 text-sm text-white">
                {intervals.map((time, index) => (
                  <li key={index}>
                    <button
                      onClick={() => {
                        setIntervalTime(time);
                        setDropdownOpen(false);
                      }}
                      className="block px-4 py-2 w-full text-left hover:bg-gray-100 hover:text-black flex items-center justify-between"
                    >
                      <span className="text-xs md:text-sm">{intervalLabels[index]}</span>
                      {intervalTime === time && <FaCheck className="text-green-400 ml-2" />}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col gap-4 md:gap-6 animate-pulse">
          {/* Skeleton do gráfico + legenda */}
          <div className="flex flex-col gap-4">
            <div className="w-full h-48 md:h-72 bg-gray-700 rounded-lg" />
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 mt-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-gray-700 rounded-full"></div>
                  <div className="h-4 w-20 bg-gray-700 rounded"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-4 md:gap-6">
          {/* Gráfico + Legenda */}
          <div className="bg-gray-800 p-4 md:p-6 rounded-lg shadow-md">
            <div className="flex flex-col items-center">
              {/* Gráfico de Rosca */}
              <div className="w-full h-64 md:h-80 lg:h-[420px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={data}
                      dataKey="count"
                      nameKey="type"
                      cx="50%"
                      cy="50%"
                      innerRadius={70}   // borda mais grossa
                      outerRadius={140}  // bola MUITO maior
                      paddingAngle={4}
                      label
                    >
                      {data.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Legenda - Agora abaixo do gráfico */}
              <div className="w-full">
                <h3 className="text-lg font-semibold mb-2 text-center">Legenda</h3>
                <div className="flex flex-wrap justify-center gap-3">
                  {data.map((attack, index) => (
                    <div key={index} className="flex items-center gap-2 min-w-[120px]">
                      <div
                        className="w-3 h-3 rounded-full flex-shrink-0"
                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                      ></div>
                      <span className="text-sm whitespace-nowrap">{attack.type}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}