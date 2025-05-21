import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import fetch from 'node-fetch';
import * as https from 'https';

interface FortiwebAdomConfig {
  name: string;
  baseUrl: string;
  username: string;
  password: string;
  adoms: string[];
}

@Injectable()
export class CrpService {
  private readonly fortiwebs: FortiwebAdomConfig[];
  private readonly httpsAgent = new https.Agent({ rejectUnauthorized: false });

  constructor(private readonly configService: ConfigService) {
    this.fortiwebs = [1, 2, 3]
      .map((index) => {
        const name = this.configService.get<string>(`FORTIWEB${index}_NAME`);
        const baseUrl = this.configService.get<string>(`FORTIWEB${index}_URL`);
        const username = this.configService.get<string>(`FORTIWEB${index}_USER`);
        const password = this.configService.get<string>(`FORTIWEB${index}_PASS`);
        const adoms = this.configService.get<string>(`FORTIWEB${index}_ADOMS`)?.split(',') || [];
        if (name && baseUrl && username && password && adoms.length) {
          return { name, baseUrl, username, password, adoms };
        }
        return null;
      })
      .filter((f): f is FortiwebAdomConfig => f !== null);
  }

  // Função para gerar o token
  async generateToken(fortiweb: FortiwebAdomConfig, adom: string): Promise<string | null> {
    try {
      const credentials = {
        username: fortiweb.username,
        password: fortiweb.password,
        vdom: adom
      };

      // Converte o objeto JSON para string e depois para base64
      const token = Buffer.from(JSON.stringify(credentials)).toString('base64');
      return token;
    } catch (error) {
      console.error(`Erro ao gerar token no FortiWeb ${fortiweb.name} [${adom}]`, error);
      return null;
    }
  }

  // Função para buscar CRPs e somar o total por FortiWeb e ADOM
  async getTotalContentRoutingPolicies(): Promise<any> {
    const resultados = {
      fortiwebs: [] as Array<{
        name: string;
        adoms: Array<{
          name: string;
          total: number;
          error?: string;
        }>;
        total: number;
      }>,
    };

    for (const fw of this.fortiwebs) {
      const fortiwebResult = {
        name: fw.name,
        adoms: [] as Array<{
          name: string;
          total: number;
          error?: string;
        }>,
        total: 0,
      };

      for (const adom of fw.adoms) {
        const token = await this.generateToken(fw, adom);
        if (!token) {
          console.warn(`  ⚠️ Token não gerado para ${fw.name} [${adom}]`);
          continue;
        }

        try {
          const url = `${fw.baseUrl}/api/v2.0/cmdb/server-policy/http-content-routing-policy`;

          const response = await fetch(url, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: token,
            },
            agent: this.httpsAgent,
          });

          const data = await response.json();
          let adomTotal = 0;

          if (data && Array.isArray(data.results)) {

            data.results.forEach((item, index) => {
              let count = 0;
              if (Array.isArray(item['sz_content-routing-match-list'])) {
                count = item['sz_content-routing-match-list'].length;
              } else if (typeof item['sz_content-routing-match-list'] === 'number') {
                count = item['sz_content-routing-match-list'];
              } else if (Array.isArray(item['content-routing-match-list'])) {
                count = item['content-routing-match-list'].length;
              }
              adomTotal += count;

            });
          } else {
            console.warn(`  ⚠️ Dados inesperados para ${fw.name} [${adom}]`, data);
          }

          fortiwebResult.adoms.push({
            name: adom,
            total: adomTotal,
          });

          fortiwebResult.total += adomTotal;
        } catch (error) {
          console.error(`  ❌ Erro ao buscar CRPs no FortiWeb ${fw.name} [${adom}]`, error);
          fortiwebResult.adoms.push({
            name: adom,
            total: 0,
            error: error.message,
          });
        }
      }

      resultados.fortiwebs.push(fortiwebResult);
    }

    return resultados;
  }


}