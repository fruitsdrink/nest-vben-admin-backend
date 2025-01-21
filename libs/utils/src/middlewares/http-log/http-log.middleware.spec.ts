import { HttpLogMiddleware } from './http-log.middleware';

describe('HttpLogMiddleware', () => {
  it('should be defined', () => {
    expect(new HttpLogMiddleware()).toBeDefined();
  });
});
