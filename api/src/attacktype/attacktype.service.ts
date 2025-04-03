import { Injectable } from '@nestjs/common';
import fetch from 'node-fetch';
import * as https from 'https';

@Injectable()
export class AttackTypeService {
  private readonly API_URL = 'https://172.30.1.254/api/v2.0/system/status.monitor';
  private readonly AUTH_TOKEN = "eyJ1c2VybmFtZSI6ImFwaSIsInBhc3N3b3JkIjoiQXBpQDEyMzQ1IiwidmRvbSI6InJvb3QifQo=";

  // Função que busca os dados de tipos de ataques do FortiWeb
  async getAttackTypes(): Promise<{ type: string; count: number }[]> {
    try {
      const response = await fetch(this.API_URL, {
        method: 'GET',
        headers: {
          Authorization: this.AUTH_TOKEN,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        agent: new https.Agent({
          rejectUnauthorized: false, // Ignora certificados SSL inválidos
        }),
      });

      if (!response.ok) {
        throw new Error(`Erro ao buscar dados: ${response.status}`);
      }

      const body = await response.json();

      if (body.results && body.results.threat_by_attack_type) {
        return body.results.threat_by_attack_type.map((item: any) => ({
          type: item.type || "Desconhecido",
          count: parseInt(item.count, 10) || 0,
        }));
      }

      throw new Error('A resposta da API não contém os dados esperados.');
    } catch (error) {
      throw new Error(`Erro ao fazer a requisição: ${error.message}`);
    }
  }
}