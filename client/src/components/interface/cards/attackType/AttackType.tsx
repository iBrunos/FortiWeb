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
    <div className="p-6 bg-gray-900 text-white rounded-2xl shadow-lg w-full relative">
      {/* Dropdown de atualização */}
      <div className="absolute top-4 right-4">
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="text-white bg-slate-900 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-2xl text-sm px-5 py-2.5 flex items-center gap-1"
        >
          <IoIosSettings className="w-5 h-5" />
          <GoTriangleDown />
        </button>
        {dropdownOpen && (
          <div className="absolute right-0 mt-2 z-10 bg-gray-800 divide-y divide-gray-100 rounded-2xl border-2 shadow-sm w-44 dark:bg-gray-700">
            <ul className="py-2 text-sm text-white dark:text-gray-200">
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
      <h2 className="text-2xl font-bold text-center mb-4">Ataques por Tipo</h2>

      {loading ? (
        <div className="flex flex-col md:flex-row gap-6 animate-pulse">
          {/* Skeleton da tabela */}
          <div className="flex-1 space-y-4">
            {[...Array(6)].map((_, idx) => (
              <div key={idx} className="h-10 bg-gray-700 rounded w-full"></div>
            ))}
          </div>

          {/* Skeleton do gráfico + legenda */}
          <div className="flex-1 flex flex-col md:flex-row gap-4">
            <div className="w-full md:w-2/3 h-72 bg-gray-700 rounded-lg" />
            <div className="md:w-1/3 space-y-3 mt-6 md:mt-0">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-4 w-32 bg-gray-700 rounded" />
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col md:flex-row gap-6">
          {/* Tabela */}
          <div className="relative overflow-x-auto flex-1">
            <table className="w-full text-sm text-left text-gray-400">
              <thead className="text-xs uppercase bg-gray-700 text-gray-300">
                <tr>
                  <th className="px-6 py-3">Tipo de Ataque</th>
                  <th className="px-6 py-3 text-right">Quantidade</th>
                </tr>
              </thead>
              <tbody>
                {data.map((attack, index) => (
                  <tr
                    key={index}
                    className="border-b border-gray-600 bg-gray-800 hover:bg-gray-700"
                  >
                    <td className="px-6 py-4">{attack.type}</td>
                    <td className="px-6 py-4 text-right font-semibold">{attack.count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Gráfico + Legenda */}
          <div className="bg-gray-800 p-6 rounded-lg shadow-md flex flex-col md:flex-row items-center flex-1">
            {/* Gráfico de Rosca */}
            <div className="w-full md:w-2/3 h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data}
                    dataKey="count"
                    nameKey="type"
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    fill="#8884d8"
                    paddingAngle={5}
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

            {/* Legenda ao lado */}
            <div className="md:w-1/3 flex flex-col items-start mt-6 md:mt-0 md:pl-6">
              <h3 className="text-lg font-semibold mb-3">Legenda</h3>
              {data.map((attack, index) => (
                <div key={index} className="flex items-center mb-2">
                  <div
                    className="w-4 h-4 rounded-full mr-2"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  ></div>
                  <span>{attack.type}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}