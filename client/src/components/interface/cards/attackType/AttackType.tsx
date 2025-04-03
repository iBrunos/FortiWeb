"use client";

import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

interface AttackType {
  type: string;
  count: number;
}

// Paleta de cores para o gráfico
const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A28DFF", "#FF6699"];

export default function AttackType() {
  const [data, setData] = useState<AttackType[]>([]);
  const [loading, setLoading] = useState(true);

  // Função para buscar os dados
  const fetchData = () => {
    fetch("http://localhost:3001/attacktype/list")
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

  // Efeito para buscar os dados e atualizar a cada 5s
  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 50000); // Atualiza a cada 10s
    return () => clearInterval(interval); // Limpa o intervalo ao desmontar
  }, []);

  return (
    <div className="p-6 bg-gray-900 text-white rounded-lg shadow-lg w-full">
      <h2 className="text-2xl font-bold text-center mb-4">Ataques por Tipo</h2>

      {loading ? (
        <p className="text-center">Carregando...</p>
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