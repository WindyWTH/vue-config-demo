import axios from "axios";

function handleError(error) {
  if (process.env.NODE_ENV === "development") {
    console.log(error);
  }
  // message提示
}

// 创建请求实例
function createService() {
  const service = axios.create();
  service.interceptors.request(
    (config) => {
      return config;
    },
    (error) => {
      console.log(error);
      return Promise.reject(error);
    }
  );
  service.interceptors.response(
    (response) => {
      if (!response.data.code) {
        return response.data;
      }
      switch (response.data.code) {
        case 0:
          return response.data;
        case 401:
          throw new Error("请重新登录");
        default:
          throw new Error(`${response.data.msg}: ${response.config.url}`);
      }
    },
    (error) => {
      const status = error.response.status;
      switch (status) {
        case 400:
          error.message = "请求错误";
          break;
        case 401:
          error.message = "未授权，请登录";
          break;
        case 403:
          error.message = "拒绝访问";
          break;
        case 404:
          error.message = `请求地址出错: ${error.response.config.url}`;
          break;
        case 408:
          error.message = "请求超时";
          break;
        case 500:
          error.message = "服务器内部错误";
          break;
        case 501:
          error.message = "服务未实现";
          break;
        case 502:
          error.message = "网关错误";
          break;
        case 503:
          error.message = "服务不可用";
          break;
        case 504:
          error.message = "网关超时";
          break;
        case 505:
          error.message = "HTTP版本不受支持";
          break;
        default:
          break;
      }
      handleError(error);
      throw error;
    }
  );

  return service;
}

function createRequest(service) {
  return function (config) {
    const token = "token"; // get token
    const defaultConfig = {
      headers: {
        Authorization: token,
        "Content-Type": "application/json",
      },
      timeout: 5000,
      baseURL: process.env.VUE_APP_API,
      data: {},
      params: {},
    };
    const option = Object.assign(defaultConfig, config);
    return service(option);
  };
}

const service = createService();
export const request = createRequest(service);
