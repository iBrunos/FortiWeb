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
        adoms: [] as Array<{ name: string; total: number; error?: string }>,
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
            headers: { 'Content-Type': 'application/json', Authorization: token },
            agent: this.httpsAgent,
          });

          const data = await response.json();
          let adomTotal = 0;

          if (data && Array.isArray(data.results)) {
            data.results.forEach((item) => {
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

          fortiwebResult.adoms.push({ name: adom, total: adomTotal });
          fortiwebResult.total += adomTotal;
        } catch (error) {
          console.error(`  ❌ Erro ao buscar CRPs no FortiWeb ${fw.name} [${adom}]`, error);
          fortiwebResult.adoms.push({ name: adom, total: 0, error: error.message });
        }
      }

      resultados.fortiwebs.push(fortiwebResult);
    }

    return resultados;
  }

// Função para buscar CRPs de uma ADOM específica
// Função para buscar CRPs de uma ADOM específica
async getCrpsByAdom(adom: string): Promise<any> {
  let username = '';
  let password = '';

  if (['LIMPURB','SMS','SEGOV','SEMIT','CASACIVIL','SECOM','SEMGE','PGMS','SEFAZ','SEDUR','SECIS','SECULT','SEMDEC','CGM','SEMUR','SPMJ'].includes(adom)) {
    username = this.configService.get<string>('FORTIWEB2_USER');
    password = this.configService.get<string>('FORTIWEB2_PASS');
  } else if (['SEINFRA','SEMAN','SEMOP','SEMOB','TRANSALVADO','SEMPRE','SMED','FMLF','FGM','FCM','DESAL','GCMS','SALTUR','PMLF'].includes(adom)) {
    username = this.configService.get<string>('FORTIWEB3_USER');
    password = this.configService.get<string>('FORTIWEB3_PASS');
  } else if (['COGEL','SACPB'].includes(adom)) {
    username = this.configService.get<string>('FORTIWEB4_USER');
    password = this.configService.get<string>('FORTIWEB4_PASS');
  } else {
    throw new Error(`ADOM "${adom}" não reconhecida`);
  }

  const fwUrl = this.configService.get<string>('FORTIWEB2_URL');

  const token = Buffer.from(JSON.stringify({ username, password, vdom: adom })).toString('base64');

  const response = await fetch(`${fwUrl}/api/v2.0/cmdb/server-policy/http-content-routing-policy`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json', Authorization: token },
    agent: this.httpsAgent,
  });

  let data;
  try {
    data = await response.json();
  } catch {
    data = { results: [] };
  }

 return Array.isArray(data.results)
  ? data.results.map((item: any) => ({
      crp: item.name ? item.name.replace(/^CRP_/, '') + '.salvador.ba.gov.br' : '',
      server: item["server-pool"] || '',
    }))
  : [];

}
}