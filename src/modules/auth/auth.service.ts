import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { JsonDbService } from '../../common/json-db/json-db.service';
import { LoginDto } from './dto/login.dto';

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  creditScore: number;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly db: JsonDbService,
    private readonly jwt: JwtService,
  ) {}

  async login(dto: LoginDto) {
    const users = await this.db.read<User>('users');
    // dummy login: plain-text compare. Use bcrypt in a real app.
    const user = users.find(
      (u) => u.email === dto.email && u.password === dto.password,
    );
    if (!user) throw new UnauthorizedException('Invalid email or password');

    const accessToken = await this.jwt.signAsync({ sub: user.id, email: user.email });
    return {
      accessToken,
      user: { id: user.id, name: user.name, email: user.email },
    };
  }

  async me(userId: string) {
    const users = await this.db.read<User>('users');
    const user = users.find((u) => u.id === userId);
    if (!user) throw new UnauthorizedException();
    const { password, ...safe } = user;
    return safe;
  }
}
