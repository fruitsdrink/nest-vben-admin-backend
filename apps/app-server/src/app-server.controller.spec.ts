import { Test, TestingModule } from '@nestjs/testing';
import { AppServerController } from './app-server.controller';
import { AppServerService } from './app-server.service';

describe('AppServerController', () => {
  let appServerController: AppServerController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppServerController],
      providers: [AppServerService],
    }).compile();

    appServerController = app.get<AppServerController>(AppServerController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(appServerController.getHello()).toBe('Hello World!');
    });
  });
});
