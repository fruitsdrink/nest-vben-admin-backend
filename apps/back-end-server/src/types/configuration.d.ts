export type Configuration = {
  http: {
    host: string;
    port: number;
    enableSwagger: boolean;
    cors: {
      origin: string;
    };
  };
  jwt: {
    secret: string;
    expiresIn: string;
    enableCookie: boolean;
  };
};
