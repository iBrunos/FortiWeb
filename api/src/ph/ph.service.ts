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
export class PhService {
  private readonly fortiwebs: FortiwebAdomConfig[];
  private readonly httpsAgent = new https.Agent({ rejectUnauthorized: false });

  constructor(private readonly configService: ConfigService) {
    this.fortiwebs = [1, 2, 3, 4]
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

      const token = Buffer.from(JSON.stringify(credentials)).toString('base64');
      return token;
    } catch (error) {
      console.error(`Erro ao gerar token no FortiWeb ${fortiweb.name} [${adom}]`, error);
      return null;
    }
  }

  // Função principal para buscar os Protected Hostnames
  async getTotalProtectedHostnames(): Promise<any> {
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
          const url = `${fw.baseUrl}/api/v2.0/cmdb/server-policy/allow-hosts`;
          const response = await fetch(url, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: token,
            },
            agent: this.httpsAgent,
          });

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const data = await response.json();
          let adomTotal = 0;

          if (data && Array.isArray(data.results)) {
            // Conta os hosts em cada entrada
            data.results.forEach((item) => {
              if (Array.isArray(item['sz_host-list'])) {
                adomTotal += item['sz_host-list'].length;
              } else if (typeof item['sz_host-list'] === 'number') {
                adomTotal += item['sz_host-list'];
              } else if (Array.isArray(item['host-list'])) {
                adomTotal += item['host-list'].length;
              }
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
          console.error(`  ❌ Erro ao buscar Protected Hosts no FortiWeb ${fw.name} [${adom}]`, error);
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