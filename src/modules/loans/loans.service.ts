import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { randomUUID } from 'crypto';
import { JsonDbService } from '../../common/json-db/json-db.service';
import { ApplyLoanDto } from './dto/apply-loan.dto';

export interface Loan {
  id: string;
  name: string;
  description: string;
  interestRate: number;
  minAmount: number;
  maxAmount: number;
  minTenureMonths: number;
  maxTenureMonths: number;
}

export interface LoanApplication {
  id: string;
  userId: string;
  loanId: string;
  loanName: string;
  amount: number;
  tenureMonths: number;
  interestRate: number;
  emi: number;
  purpose?: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  appliedAt: string;
}

@Injectable()
export class LoansService {
  constructor(private readonly db: JsonDbService) {}

  findAll() {
    return this.db.read<Loan>('loans');
  }

  async findOne(id: string) {
    const loans = await this.findAll();
    const loan = loans.find((l) => l.id === id);
    if (!loan) throw new NotFoundException(`Loan "${id}" not found`);
    return loan;
  }

  async apply(userId: string, dto: ApplyLoanDto) {
    const loan = await this.findOne(dto.loanId);

    if (dto.amount < loan.minAmount || dto.amount > loan.maxAmount) {
      throw new BadRequestException(
        `Amount must be between ${loan.minAmount} and ${loan.maxAmount}`,
      );
    }
    if (
      dto.tenureMonths < loan.minTenureMonths ||
      dto.tenureMonths > loan.maxTenureMonths
    ) {
      throw new BadRequestException(
        `Tenure must be between ${loan.minTenureMonths} and ${loan.maxTenureMonths} months`,
      );
    }

    const applications = await this.db.read<LoanApplication>('applications');
    const alreadyPending = applications.some(
      (a) => a.userId === userId && a.loanId === loan.id && a.status === 'PENDING',
    );
    if (alreadyPending) {
      throw new ConflictException('You already have a pending application for this loan');
    }

    const application: LoanApplication = {
      id: randomUUID(),
      userId,
      loanId: loan.id,
      loanName: loan.name,
      amount: dto.amount,
      tenureMonths: dto.tenureMonths,
      interestRate: loan.interestRate,
      emi: this.calculateEmi(dto.amount, loan.interestRate, dto.tenureMonths),
      purpose: dto.purpose,
      status: 'PENDING',
      appliedAt: new Date().toISOString(),
    };

    applications.push(application);
    await this.db.write('applications', applications);
    return application;
  }

  async myApplications(userId: string) {
    const applications = await this.db.read<LoanApplication>('applications');
    return applications.filter((a) => a.userId === userId);
  }

  private calculateEmi(principal: number, annualRate: number, months: number) {
    const r = annualRate / 12 / 100;
    const factor = Math.pow(1 + r, months);
    const emi = (principal * r * factor) / (factor - 1);
    return Math.round(emi * 100) / 100;
  }
}
