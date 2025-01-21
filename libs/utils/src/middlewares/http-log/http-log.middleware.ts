import {
  Inject,
  Injectable,
  LoggerService,
  NestMiddleware,
} from '@nestjs/common';
import { error } from 'console';
import { Request, Response } from 'express';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

type ReqData = {
  method: string;
  url: string;
  body: any;
  query: any;
  params: any;
  header: any;
};
@Injectable()
export class HttpLogMiddleware implements NestMiddleware {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
  ) {}

  use(req: Request, res: Response, next: () => void) {
    // 开始计时
    const start = Date.now();

    // 请求数据
    const method = req.method;
    const url = req.originalUrl;
    const body = req.body;
    const query = req.query;
    const params = req.params;
    const header = req.headers;
    const reqData = {
      method,
      url,
      body,
      query,
      params,
      header,
    };

    next();

    if (req.statusCode >= 400) {
      const duration = getDuration(start);

      this.logger.error({
        request: reqData,
        duration,
        error,
      }); // error
    } else {
      getResponseLog(res, reqData, this.logger, start);
    }
  }
}

const getDuration = (start: number) => {
  const duration = Date.now() - start;
  return duration < 1000 ? `${duration}ms` : `${(duration / 1000).toFixed(2)}s`;
};

const getResponseLog = (
  res: Response,
  reqData: ReqData,
  logger: LoggerService,
  start: number,
) => {
  const rawResponse = res.write;
  const rawResponseEnd = res.end;

  const chunkBuffers = [];

  res.write = (...chunks) => {
    const resArgs = [];
    for (let i = 0; i < chunks.length; i++) {
      resArgs[i] = chunks[i];
      if (!resArgs[i]) {
        res.once('drain', res.write);
        i--;
      }
    }
    if (resArgs[0]) {
      chunkBuffers.push(Buffer.from(resArgs[0]));
    }
    return rawResponse.apply(res, resArgs);
  };

  res.end = (...chunk) => {
    const resArgs = [];
    for (let i = 0; i < chunk.length; i++) {
      resArgs[i] = chunk[i];
    }
    if (resArgs[0]) {
      chunkBuffers.push(Buffer.from(resArgs[0]));
    }
    const body = Buffer.concat(chunkBuffers).toString('utf8');
    res.setHeader('origin', 'restjs-req-res-logging-repo');

    const responseLog = {
      statusCode: res.statusCode,
      headers: res.getHeaders() ? JSON.stringify(res.getHeaders()) : '',
      statusMessage: res.statusMessage,
      body: JSON.parse(body) || body || {},
      // Returns a shallow copy of the current outgoing headers
    };
    const duration = getDuration(start);
    logger.log({
      request: reqData,
      response: responseLog,
      duration,
    });
    rawResponseEnd.apply(res, resArgs);
    return responseLog as unknown as Response;
  };
};
