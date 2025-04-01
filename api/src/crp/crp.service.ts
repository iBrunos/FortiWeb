import { Injectable } from '@nestjs/common';
import fetch from 'node-fetch';
import * as https from 'https';

@Injectable()
export class CrpService {
  private readonly API_URL = 'https://172.30.1.254/api/v2.0/cmdb/server-policy/http-content-routing-policy';
  private readonly AUTH_TOKEN = "eyJ1c2VybmFtZSI6ImFwaSIsInBhc3N3b3JkIjoiQXBpQDEyMzQ1IiwidmRvbSI6InJvb3QifQo=";

  // Função que faz a requisição GET para a API externa e calcula o total
  async getTotalContentRoutingPolicies(): Promise<number> {
    try {
      const response = await fetch(this.API_URL, {
        method: 'GET',
        headers: {
          Authorization: this.AUTH_TOKEN,  // Aqui está o formato correto
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        agent: new https.Agent({
          rejectUnauthorized: false, // Desabilita a verificação de certificado (não recomendado para produção)
        }),
      });

      // Verifica se a resposta foi bem-sucedida
      if (!response.ok) {
        throw new Error(`Erro ao buscar dados: ${response.status}`);
      }

      // Pega o corpo da resposta
      const body = await response.json();

      // Verifica se a resposta contém o campo 'results' como esperado
      if (body.results && Array.isArray(body.results)) {
        // Calcula o total baseado na propriedade 'sz_content-routing-match-list'
        const total = body.results.reduce((acc, item) => acc + (item['sz_content-routing-match-list'] || 0), 0);
        return total;
      }

      // Caso o formato da resposta não seja o esperado, lança erro
      throw new Error('A resposta da API não contém os dados esperados.');
      
    } catch (error) {
      // Trata os erros e retorna uma mensagem mais descritiva
      throw new Error(`Erro ao fazer a requisição: ${error.message}`);
    }
  }
}
