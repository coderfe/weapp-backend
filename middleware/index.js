import jwt from 'jsonwebtoken';
import { SECRET_KEY } from '../config/index.js';

export const responseTime = async (ctx, next) => {
  const start = Date.now();
  await next();
  const responseTime = Date.now() - start;
  ctx.set('X-Response-Time', `${responseTime}ms`);
};

export const logger = async (ctx, next) => {
  await next();
  const responseTime = ctx.response.header['x-response-time'];
  console.log(`${ctx.method} - ${ctx.url} ${responseTime}`);
};

export const verifyToken = async (ctx, next) => {
  if (isWhitelist(ctx.url)) {
    await next();
  } else {
    const authHeader = ctx.request.header['authorization'];
    if (!authHeader) {
      ctx.status = 403;
    } else {
      const bearerToken = authHeader.split(' ')[1];
      const decode = jwt.verify(bearerToken, SECRET_KEY);
      if (decode) {
        ctx.openId = decode.oid;
        ctx.sessionKey = decode.ssk;
        await next();
      } else {
        ctx.status = 403;
      }
    }
  }
};

const isWhitelist = (url) => {
  return /^(\/login)/.test(url);
};
