import { IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class ApplyLoanDto {
  @IsString()
  @IsNotEmpty()
  loanId: string;

  @IsNumber()
  @Min(1)
  amount: number;

  @IsInt()
  @Min(1)
  tenureMonths: number;

  @IsOptional()
  @IsString()
  purpose?: string;
}
