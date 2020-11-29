import axios from 'axios';
import { APP_ID, APP_SECRET, GRANT_TYPE } from '../config/index.js';

export default class WeChatAuth {
  constructor() {
    this.http = axios.create({
      baseURL: 'https://api.weixin.qq.com'
    });

    this.http.interceptors.response.use(
      (response) => {
        return response.data;
      },
      (error) => {
        return Promise.reject(error);
      }
    );
  }

  async code2Session(jsCode) {
    return await this.http.get('/sns/jscode2session', {
      params: {
        appid: APP_ID,
        secret: APP_SECRET,
        js_code: jsCode,
        grant_type: GRANT_TYPE.AUTHORIZATION_CODE
      }
    });
  }

  async getAccessToken() {
    return await this.http.get('/cgi-bin/token', {
      params: {
        grant_type: GRANT_TYPE.CLIENT_CREDENTIAL,
        appid: APP_ID,
        secret: APP_SECRET
      }
    });
  }

  async msgSecCheck(accessToken, content) {
    return await this.http.post(
      '/wxa/msg_sec_check',
      { content },
      {
        params: { access_token: accessToken }
      }
    );
  }

  async sendTemplateMessage({ accessToken, openId, templateId, data }) {
    return await this.http.post(
      '/cgi-bin/message/subscribe/send',
      {
        touser: openId,
        template_id: templateId,
        data
      },
      {
        params: {
          access_token: accessToken
        }
      }
    );
  }
}
