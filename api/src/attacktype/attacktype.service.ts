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
export class AttackTypeService {
  private readonly fortiwebs: FortiwebAdomConfig[];
  private readonly httpsAgent = new https.Agent({ rejectUnauthorized: false });

  constructor(private readonly configService: ConfigService) {
    this.fortiwebs = [1, 2, 3, 4]
      .map((index) => {
        const name = this.configService.get<string>(`FORTIWEB${index}_NAME`);
        const baseUrl = this.configService.get<string>(`FORTIWEB${index}_URL`);
        const username = this.configService.get<string>(`FORTIWEB${index}_USER`);
        const password = this.configService.get<string>(`FORTIWEB${index}_PASS`);
        const adoms = this.configService
          .get<string>(`FORTIWEB${index}_ADOMS`)
          ?.split(',') || [];

        if (name && baseUrl && username && password && adoms.length > 0) {
          return { name, baseUrl, username, password, adoms };
        }

        return null;
      })
      .filter((f): f is FortiwebAdomConfig => f !== null);
  }

  // ------------------------------
  // Gera token por FortiWeb + ADOM
  // ------------------------------
  private generateToken(fortiweb: FortiwebAdomConfig, adom: string): string {
    const creds = {
      username: fortiweb.username,
      password: fortiweb.password,
      vdom: adom,
    };
    return Buffer.from(JSON.stringify(creds)).toString('base64');
  }

  // -----------------------------------------
  // Busca tipos de ataque de um ADOM específico
  // -----------------------------------------
  private async fetchAttackTypes(
    fortiweb: FortiwebAdomConfig,
    adom: string,
  ): Promise<{ type: string; count: number }[]> {
    const token = this.generateToken(fortiweb, adom);

    const url = `${fortiweb.baseUrl}/api/v2.0/system/status.monitor?vdom=${adom}`;

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Authorization: token,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        agent: this.httpsAgent,
      });

      if (!response.ok) {
        console.error(`❌ Erro no FortiWeb ${fortiweb.name} [${adom}]: ${response.status}`);
        return [];
      }

      const body = await response.json();

      const list = body?.results?.threat_by_attack_type ?? [];

      return list.map((item: any) => ({
        type: item.type || 'Desconhecido',
        count: parseInt(item.count, 10) || 0,
      }));
    } catch (error) {
      console.error(`❌ Erro ao buscar ADOM ${adom} no ${fortiweb.name}:`, error);
      return [];
    }
  }

  // -----------------------------------------------------
  // FUNÇÃO PRINCIPAL → percorre tudo e soma os resultados
  // -----------------------------------------------------
  async getAttackTypes(): Promise<{ type: string; count: number }[]> {
    const aggregated: Record<string, number> = {};

    for (const fw of this.fortiwebs) {
      for (const adom of fw.adoms) {
        const attacks = await this.fetchAttackTypes(fw, adom);

        for (const item of attacks) {
          if (!aggregated[item.type]) aggregated[item.type] = 0;
          aggregated[item.type] += item.count;
        }
      }
    }

    // Converte para array final
    return Object.entries(aggregated).map(([type, count]) => ({
      type,
      count,
    }));
  }
}
