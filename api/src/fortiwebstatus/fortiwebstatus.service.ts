import { Injectable } from '@nestjs/common';
import fetch from 'node-fetch';
import * as https from 'https';

@Injectable()
export class FortiWebStatusService {
  private readonly API_URL = 'https://172.30.1.254/api/v2.0/system/status.monitor';
  private readonly AUTH_TOKEN = "eyJ1c2VybmFtZSI6ImFwaSIsInBhc3N3b3JkIjoiQXBpQDEyMzQ1IiwidmRvbSI6InJvb3QifQo=";

  // Função que busca os dados de status do FortiWeb
  async getFortiWebStatus(): Promise<{ cpu: number; memory: number; disk: number; tcp_concurrent_connection: number; status: number; throughput_in: number; throughput_out: number }> {
    try {
      const response = await fetch(this.API_URL, {
        method: 'GET',
        headers: {
          Authorization: this.AUTH_TOKEN,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        agent: new https.Agent({
          rejectUnauthorized: false,
        }),
      });

      if (!response.ok) {
        throw new Error(`Erro ao buscar dados: ${response.status}`);
      }

      const body = await response.json();

      if (body.results) {
        return {
          cpu: body.results.cpu || 0,
          memory: body.results.memory || 0,
          disk: body.results.log_disk || 0,
          tcp_concurrent_connection: body.results.tcp_concurrent_connection || 0,
          status: body.results.status || 0,
          throughput_in: body.results.throughput_in || 0,
          throughput_out: body.results.throughput_out || 0
        };
      }

      throw new Error('A resposta da API não contém os dados esperados.');
    } catch (error) {
      throw new Error(`Erro ao fazer a requisição: ${error.message}`);
    }
  }
}