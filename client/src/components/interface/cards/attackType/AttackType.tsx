"use client";

import { useEffect, useState } from "react";

interface AttackType {
  type: string;
  count: number;
}

export default function AttackType() {
  const [data, setData] = useState<AttackType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
  }, []);

  return (
    <div className="p-6 bg-gray-900 text-white rounded-lg shadow-lg w-full max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-center mb-4">Ataques por Tipo</h2>

      {loading ? (
        <p className="text-center">Carregando...</p>
      ) : (
        <div className="relative overflow-x-auto">
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
      )}
    </div>
  );
}
