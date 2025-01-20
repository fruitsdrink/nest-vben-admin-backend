import { Injectable } from '@nestjs/common';

@Injectable()
export class AppServerService {
  getHello(): string {
    return 'Hello World!';
  }
}
