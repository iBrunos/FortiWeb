import { Injectable } from '@nestjs/common';
import fetch from 'node-fetch';
import * as https from 'https';

@Injectable()
export class CrpService {
  private readonly API_URL = 'https://172.30.1.254/api/v2.0/cmdb/server-policy/http-content-routing-policy';
  private readonly MATCH_LIST_URL = 'https://172.30.1.254/api/v2.0/cmdb/server-policy/http-content-routing-policy/content-routing-match-list';
  private readonly AUTH_TOKEN = 'eyJ1c2VybmFtZSI6ImFwaSIsInBhc3N3b3JkIjoiQXBpQDEyMzQ1IiwidmRvbSI6InJvb3QifQo=';

  private getHeaders() {
    return {
      Authorization: this.AUTH_TOKEN,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    };
  }

  async getTotalContentRoutingPolicies(): Promise<number> {
    try {
      const response = await fetch(this.API_URL, {
        method: 'GET',
        headers: this.getHeaders(),
        agent: new https.Agent({ rejectUnauthorized: false }),
      });

      if (!response.ok) {
        throw new Error(`Erro ao buscar dados: ${response.status}`);
      }

      const body = await response.json();

      if (body.results && Array.isArray(body.results)) {
        const total = body.results.reduce(
          (acc, item) => acc + (item['sz_content-routing-match-list'] || 0),
          0,
        );
        return total;
      }

      throw new Error('A resposta da API não contém os dados esperados.');
    } catch (error) {
      throw new Error(`Erro ao fazer a requisição: ${error.message}`);
    }
  }

  async getContentRoutingExpressions(
    page: number,
    limit: number,
  ): Promise<{ total: number; data: { crp: string; matchExpressions: string[] }[] }> {
    try {

      const response = await fetch(this.API_URL, {
        method: 'GET',
        headers: this.getHeaders(),
        agent: new https.Agent({ rejectUnauthorized: false }),
      });
  
      if (!response.ok) {
        throw new Error(`Erro ao buscar CRPs: ${response.status}`);
      }
  
      const body = await response.json();
  
      if (!body.results || !Array.isArray(body.results)) {
        throw new Error('A resposta não contém CRPs válidos.');
      }
  
      const allCrps = body.results;
      const total = allCrps.length;
  
      const startIndex = (page - 1) * limit;
      const endIndex = page * limit;
      const paginatedResults = allCrps.slice(startIndex, endIndex);
  
      const data = await Promise.all(
        paginatedResults.map(async (item) => {
          const crpName = item.name;
          const detailUrl = `${this.MATCH_LIST_URL}?mkey=${encodeURIComponent(crpName)}`;
  
          try {
            const detailResponse = await fetch(detailUrl, {
              method: 'GET',
              headers: this.getHeaders(),
              agent: new https.Agent({ rejectUnauthorized: false }),
            });
  
            if (!detailResponse.ok) {
              console.warn(`Erro ao buscar match-list de ${crpName}`);
              return { crp: crpName, matchExpressions: [] };
            }
  
            const detail = await detailResponse.json();
            const matchList = detail.results || [];
  
            const expressions = matchList
              .map((match: any) => match['match-expression'])
              .filter((expr: string) => !!expr);
  
  
            return { crp: crpName, matchExpressions: expressions };
          } catch (err) {
            console.error(`Erro ao buscar expressões para ${crpName}:`, err.message);
            return { crp: crpName, matchExpressions: [] };
          }
        }),
      );
  
      return {
        total,
        data,
      };
    } catch (error) {
      console.error('Erro em getContentRoutingExpressions:', error.message);
      throw new Error(`Erro ao buscar expressões de roteamento: ${error.message}`);
    }
  }
}