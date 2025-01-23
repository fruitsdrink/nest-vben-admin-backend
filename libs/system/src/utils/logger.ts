import dayjs from 'dayjs';
import { utilities as nestWinstonModuleUtilities } from 'nest-winston';
import { join } from 'path';
import winston from 'winston';

export const createTransport = () => {
  const consoleTransport = new winston.transports.Console({
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.ms(),
      nestWinstonModuleUtilities.format.nestLike('back-end-server', {
        colors: true,
        prettyPrint: true,
        processId: true,
        appName: true,
      }),
    ),
  });

  const fileTransport = new winston.transports.File({
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.ms(),
      nestWinstonModuleUtilities.format.nestLike('back-end-server', {
        colors: false,
        prettyPrint: true,
        processId: true,
        appName: true,
      }),
    ),
    filename: join(
      process.cwd(),
      'logs',
      'back-end-server',
      `${dayjs().format('YYYY-MM-DD')}.log`,
    ),
  });

  const transports = [fileTransport] as any[];

  if (process.env.NODE_ENV === 'development') {
    transports.push(consoleTransport);
  }

  return transports;
};
