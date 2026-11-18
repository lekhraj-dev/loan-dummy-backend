import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/guards/auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { LoansService } from './loans.service';
import { ApplyLoanDto } from './dto/apply-loan.dto';

@UseGuards(AuthGuard) // applies to every route in this controller
@Controller('loans')
export class LoansController {
  constructor(private readonly loansService: LoansService) {}

  @Get()
  findAll() {
    return this.loansService.findAll();
  }

  // NOTE: must be declared before ':id', otherwise "applications" is treated as an id
  @Get('applications/mine')
  myApplications(@CurrentUser() user: { id: string }) {
    return this.loansService.myApplications(user.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.loansService.findOne(id);
  }

  @Post('apply')
  apply(@CurrentUser() user: { id: string }, @Body() dto: ApplyLoanDto) {
    return this.loansService.apply(user.id, dto);
  }
}
