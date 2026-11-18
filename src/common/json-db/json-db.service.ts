import { Injectable } from '@nestjs/common';
import { promises as fs } from 'fs';
import { join } from 'path';

@Injectable()
export class JsonDbService {
  private readonly dir = join(process.cwd(), 'data');

  private path(name: string) {
    return join(this.dir, `${name}.json`);
  }

  async read<T>(name: string): Promise<T[]> {
    const raw = await fs.readFile(this.path(name), 'utf-8');
    return JSON.parse(raw) as T[];
  }

  async write<T>(name: string, data: T[]): Promise<void> {
    await fs.writeFile(this.path(name), JSON.stringify(data, null, 2), 'utf-8');
  }
}
