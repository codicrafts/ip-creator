import axios, { AxiosRequestConfig, AxiosResponse } from "axios";

/**
 * 将 Node.js Buffer 转换为 ArrayBuffer
 */
function bufferToArrayBuffer(buffer: Buffer): ArrayBuffer {
  // 如果 Buffer 有 underlying ArrayBuffer，直接使用
  if (buffer.buffer instanceof ArrayBuffer) {
    return buffer.buffer.slice(
      buffer.byteOffset,
      buffer.byteOffset + buffer.byteLength
    );
  }
  // 否则创建新的 ArrayBuffer
  const arrayBuffer = new ArrayBuffer(buffer.length);
  const view = new Uint8Array(arrayBuffer);
  for (let i = 0; i < buffer.length; i++) {
    view[i] = buffer[i];
  }
  return arrayBuffer;
}

/**
 * 将 axios 响应转换为 fetch Response 对象
 */
function axiosResponseToFetchResponse(axiosResponse: AxiosResponse): Response {
  // 确定响应体内容
  let body: string | ArrayBuffer | Blob;

  const { data } = axiosResponse;

  // 优先处理 Buffer（Node.js 环境）
  if (typeof Buffer !== "undefined" && Buffer.isBuffer(data)) {
    body = bufferToArrayBuffer(data);
  } else if (data instanceof ArrayBuffer) {
    body = data;
  } else if (data instanceof Blob) {
    body = data;
  } else if (typeof data === "string") {
    body = data;
  } else if (data === null || data === undefined) {
    // 空响应
    body = "";
  } else {
    // JSON 或其他对象，转换为 JSON 字符串
    // 如果对象为空，确保返回 "{}" 而不是空字符串
    body = JSON.stringify(data);
  }

  // 创建 Response 对象
  const response = new Response(body, {
    status: axiosResponse.status,
    statusText: axiosResponse.statusText || "Unknown",
    headers: new Headers(axiosResponse.headers as Record<string, string>),
  });

  // 添加 Response 的其他属性
  Object.defineProperty(response, "ok", {
    value: axiosResponse.status >= 200 && axiosResponse.status < 300,
    writable: false,
    configurable: false,
  });

  return response;
}

/**
 * 解析请求体
 */
function parseRequestBody(body: RequestInit["body"]): unknown {
  if (!body) {
    return undefined;
  }

  if (typeof body === "string") {
    try {
      return JSON.parse(body);
    } catch {
      // 如果不是 JSON，返回原始字符串
      return body;
    }
  }

  // ArrayBuffer, Blob, FormData 等直接返回
  return body;
}

/**
 * 解析请求头
 */
function parseHeaders(
  headers: RequestInit["headers"]
): Record<string, string> {
  const result: Record<string, string> = {};

  if (!headers) {
    return result;
  }

  if (headers instanceof Headers) {
    headers.forEach((value, key) => {
      result[key] = value;
    });
  } else if (Array.isArray(headers)) {
    headers.forEach(([key, value]) => {
      if (value) {
        result[key] = value;
      }
    });
  } else {
    Object.assign(result, headers);
  }

  return result;
}

/**
 * 检查是否为超时错误
 */
function isTimeoutError(error: unknown): boolean {
  if (typeof error !== "object" || error === null) {
    return false;
  }

  const err = error as { code?: string; message?: string };
  return (
    err.code === "ECONNABORTED" ||
    err.message?.toLowerCase().includes("timeout") === true
  );
}

/**
 * 根据请求类型确定响应类型
 */
function determineResponseType(
  url: string,
  headers: Record<string, string>
): AxiosRequestConfig["responseType"] {
  // 检查 Accept 头
  const accept = headers["accept"] || headers["Accept"] || "";
  
  // 如果是图片请求，使用 arraybuffer
  if (
    accept.includes("image/") ||
    url.match(/\.(png|jpg|jpeg|gif|webp|svg|ico|bmp)(\?|$)/i)
  ) {
    return "arraybuffer";
  }
  
  // 默认使用 json
  return "json";
}

/**
 * HTTP 请求封装（使用 axios，支持超时配置）
 * @param url 请求 URL
 * @param options fetch 选项
 * @param timeoutMs 超时时间（毫秒），默认 10 分钟（600000ms）
 * @returns Promise<Response>
 * @throws {Error} 请求失败时抛出错误
 */
export async function request(
  url: string | URL | Request,
  options: RequestInit = {},
  timeoutMs: number = 600000 // 10 分钟（高分辨率图片生成可能需要更长时间）
): Promise<Response> {
  try {
    const urlString = typeof url === "string" ? url : url.toString();
    const data = parseRequestBody(options.body);
    const headers = parseHeaders(options.headers);

    // 根据请求类型确定响应类型
    const responseType = determineResponseType(urlString, headers);

    // 构建 axios 配置（使用内置超时）
    const axiosConfig: AxiosRequestConfig = {
      url: urlString,
      method: (options.method as AxiosRequestConfig["method"]) || "GET",
      timeout: timeoutMs, // axios 内置超时配置
      headers,
      data,
      responseType,
      validateStatus: () => true, // 不自动抛出错误，让调用者处理
    };

    const axiosResponse = await axios(axiosConfig);

    // 转换为 fetch Response 对象
    return axiosResponseToFetchResponse(axiosResponse);
  } catch (error: unknown) {
    // 处理超时错误（axios 超时会抛出 ECONNABORTED）
    if (isTimeoutError(error)) {
      throw new Error(`Request timeout after ${timeoutMs}ms`);
    }

    // 处理其他错误
    throw error;
  }
}

// 为了向后兼容，保留 fetchWithTimeout 作为别名
export { request as fetchWithTimeout };

// 确保 request 函数被正确导出
export default request;
