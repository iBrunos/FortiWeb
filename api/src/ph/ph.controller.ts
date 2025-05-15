// src/ph/ph.controller.ts

import { Controller, Get } from '@nestjs/common';
import { PhService } from './ph.service';

@Controller('ph')
export class PhController {
  constructor(private readonly phService: PhService) {}

  @Get('total')
  async getTotal(): Promise<any> {
    return this.phService.getTotalProtectedHostnames();
  }
}
