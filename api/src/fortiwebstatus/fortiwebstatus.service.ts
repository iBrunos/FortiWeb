import { Injectable } from '@nestjs/common';
import fetch from 'node-fetch';
import * as https from 'https';

@Injectable()
export class FortiWebStatusService {
  private readonly API_URL = 'https://172.30.1.254/api/v2.0/system/status.monitor';
  private readonly AUTH_TOKEN = "eyJ1c2VybmFtZSI6ImFwaSIsInBhc3N3b3JkIjoiQXBpQDEyMzQ1NiIsInZkb20iOiJyb290In0K";

  // Função que busca os dados de status do FortiWeb
  async getFortiWebStatus(): Promise<{
    cpu: number;
    memory: number;
    disk: number;
    tcp_concurrent_connection: number;
    status: number;
    throughput_in: number;
    throughput_out: number;
  }> {
    console.log('Iniciando requisição para FortiWeb');

    try {
      console.log('URL da API:', this.API_URL);
      console.log('Token de autenticação:', this.AUTH_TOKEN);

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

      console.log('Status da resposta:', response.status);

      if (!response.ok) {
        console.error(`Erro HTTP: ${response.status}`);
        throw new Error(`Erro ao buscar dados: ${response.status}`);
      }

      const body = await response.json();
      console.log('Resposta JSON da API:', JSON.stringify(body, null, 2));

      if (body.results) {
        const parsedResult = {
          cpu: body.results.cpu || 0,
          memory: body.results.memory || 0,
          disk: body.results.log_disk || 0,
          tcp_concurrent_connection: body.results.tcp_concurrent_connection || 0,
          status: body.results.status || 0,
          throughput_in: body.results.throughput_in || 0,
          throughput_out: body.results.throughput_out || 0,
        };

        console.log('Dados extraídos com sucesso:', parsedResult);
        return parsedResult;
      }

      console.error('A resposta da API não contém a chave "results".');
      throw new Error('A resposta da API não contém os dados esperados.');
    } catch (error) {
      console.error('Erro ao fazer a requisição:', error.message);
      throw new Error(`Erro ao fazer a requisição: ${error.message}`);
    }
  }
}