import WeChatAuth from '../utils/WeChatAuth.js';
import User from '../database/User.js';
import { fail, success } from '../utils/helper.js';

const weChatAuth = new WeChatAuth();

/**
 * 发送模板消息
 * @param {} ctx
 */
export const sendTemplateMessage = async (ctx) => {
  const { templateId, data } = ctx.request.body;
  const { accessToken } = await User.findOne({
    attributes: ['accessToken'],
    where: {
      openId: ctx.openId
    }
  });
  try {
    const { errcode } = await weChatAuth.sendTemplateMessage({
      templateId,
      openId: ctx.openId,
      accessToken: accessToken,
      data
    });
    if (errcode === 0) {
      ctx.body = success(data);
    } else {
      ctx.body = fail(data);
    }
  } catch (error) {
    ctx.body = fail(error.message);
  }
};

/**
 * 内容安全检查
 * @param {*} ctx
 */
export const messageSecurityCheck = async (ctx) => {
  const user = await User.findOne({
    attributes: ['accessToken'],
    where: {
      openId: ctx.openId
    }
  });
  const { message } = ctx.request.body;
  const { errcode } = await weChatAuth.msgSecCheck(user.accessToken, message);
  ctx.body = errcode === 0 ? success(message) : fail(message);
};

/**
 * 用户登录
 * @param {*} ctx
 */
export const login = async (ctx) => {
  const { openid, session_key } = await weChatAuth.code2Session(
    ctx.query.jsCode
  );
  const { access_token } = await weChatAuth.getAccessToken();
  const token = jwt.sign({ oid: openid, ssk: session_key }, SECRET_KEY, {
    expiresIn: '10d'
  });
  const user = await User.findOne({
    where: {
      openId: openid
    }
  });
  if (user) {
    await User.update(
      {
        sessionKey: session_key,
        accessToken: access_token
      },
      { where: { openId: openid } }
    );
  } else {
    await User.create({
      openId: openid,
      sessionKey: session_key,
      accessToken: access_token
    });
  }
  ctx.body = success({ token });
};
