import { Injectable } from '@nestjs/common';
import fetch from 'node-fetch';
import * as https from 'https';

interface FortiWebStatus {
  cpu: number;
  memory: number;
  disk: number;
  tcp_concurrent_connection: number;
  status: number;
  throughput_in: number;
  throughput_out: number;
}

@Injectable()
export class FortiWebStatusService {
  private readonly fortiwebs = [
    {
      name: 'WAF01',
      url: 'https://172.30.1.254/api/v2.0/system/status.monitor',
      token: 'eyJ1c2VybmFtZSI6ImFwaSIsInBhc3N3b3JkIjoiQXBpQDEyMzQ1NiIsInZkb20iOiJyb290In0K',
    },
    {
      name: 'WAF02',
      url: 'https://10.201.131.2/api/v2.0/system/status.monitor', // coloque aqui o segundo endpoint
      token: 'eyJ1c2VybmFtZSI6ImFwaTIiLCJwYXNzd29yZCI6IkFwaTEyMzQ1QCIsInZkb20iOiJTRUlORlJBIn0=', // coloque aqui o segundo token
    },
  ];

  async getFortiWebStatus(): Promise<Record<string, FortiWebStatus>> {
    const agent = new https.Agent({ rejectUnauthorized: false });

    const results: Record<string, FortiWebStatus> = {};

    for (const fw of this.fortiwebs) {
      try {
        const response = await fetch(fw.url, {
          method: 'GET',
          headers: {
            Authorization: fw.token,
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          agent,
        });

        if (!response.ok) {
          throw new Error(`${fw.name} retornou erro HTTP ${response.status}`);
        }

        const body = await response.json();

        if (body.results) {
          results[fw.name] = {
            cpu: body.results.cpu || 0,
            memory: body.results.memory || 0,
            disk: body.results.log_disk || 0,
            tcp_concurrent_connection: body.results.tcp_concurrent_connection || 0,
            status: body.results.status || 0,
            throughput_in: body.results.throughput_in || 0,
            throughput_out: body.results.throughput_out || 0,
          };
        } else {
          console.error(`${fw.name} - Resposta sem "results".`);
          results[fw.name] = {
            cpu: 0,
            memory: 0,
            disk: 0,
            tcp_concurrent_connection: 0,
            status: 0,
            throughput_in: 0,
            throughput_out: 0,
          };
        }
      } catch (error) {
        console.error(`Erro ao consultar ${fw.name}:`, error.message);
        results[fw.name] = {
          cpu: 0,
          memory: 0,
          disk: 0,
          tcp_concurrent_connection: 0,
          status: 0,
          throughput_in: 0,
          throughput_out: 0,
        };
      }
    }
    return results;
  }
}