import Router from '@koa/router';
import jwt from 'jsonwebtoken';
import {
  sendTemplateMessage,
  messageSecurityCheck,
  login
} from '../service/index.js';

const router = new Router();

router
  .get('/login', login)
  .post('/msgSecCheck', messageSecurityCheck)
  .post('/send', sendTemplateMessage);

export default router;
