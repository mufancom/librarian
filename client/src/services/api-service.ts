import * as Url from 'url';

import axios from 'axios';

import {i18n} from 'utils/lang';

import {Translation} from '../../../shared/package/translation';

// const API_BASE_URL = 'https://librarian.mufan.io/api/';
const API_BASE_URL = 'http://localhost:3002/';

const RESOURCE_BASE_URL = 'https://librarian.mufan.io/api/';

export const API_UNKNOWN_ERROR = '网络错误';

export function fetchErrorMessage(error: any): string {
  if (error.message) {
    return error.message as string;
  }

  return API_UNKNOWN_ERROR;
}

export class APIErrorException extends Error {
  message: string;
  constructor(readonly code: string, _message: string) {
    super(_message);
    this.message = _message;
  }
}

interface APISuccessResult {
  data: any;
}

interface APIRedirectionResult {
  location: string;
}

interface APIErrorResult {
  error: {
    code: string;
    message: string;
  };
}

export type APIResult =
  | APISuccessResult
  | APIErrorResult
  | APIRedirectionResult;

export type OnProgress = (event: ProgressEvent) => void;

export interface RequestOptions {
  type?: string;
  onUploadProgress?: OnProgress;
  onDownloadProgress?: OnProgress;
}

// TODO: handle variables in error messages
function errorMessageToLocalize(_code: string, message: string): string {
  if (isKnownI18nMessageKey(message)) {
    let i18nMessage = i18n[message];

    if (typeof i18nMessage === 'string') {
      return i18nMessage;
    }

    throw new Error('Expecting message to be a string');
  }

  return message;
}

function isKnownI18nMessageKey(key: string): key is keyof Translation {
  return i18n.hasOwnProperty(key);
}

export type APIMiddleware = (
  result: APIResult,
  next: () => void,
) => Promise<void> | void;

export class APIService {
  private middlewares: APIMiddleware[] = [];

  async call<T>(
    method: string,
    path: string,
    body?: any,
    {type, onUploadProgress, onDownloadProgress}: RequestOptions = {},
  ): Promise<T> {
    let url = Url.resolve(API_BASE_URL, path);
    let response;
    try {
      response = await axios({
        method,
        url,
        withCredentials: true,
        data: body,
        headers: {
          'Content-Type': type,
        },
        onUploadProgress,
        onDownloadProgress,
      });
    } catch (error) {
      response = {data: {error}};
    }

    let result = response.data as APIResult;

    result = await this.executeMiddlewares(result);

    if ('location' in result) {
      window.location.href = result.location;
      // Unreachable
      throw undefined;
    } else if ('error' in result) {
      let {code, message} = result.error;

      throw new APIErrorException(code, errorMessageToLocalize(code, message));
    } else {
      return result.data;
    }
  }

  get<T>(path: string, data?: Dict<any>, options?: RequestOptions): Promise<T> {
    return this.call<T>('get', path, data, options);
  }

  post<T>(
    path: string,
    data?: Dict<any>,
    options?: RequestOptions,
  ): Promise<T> {
    return this.call<T>('post', path, data, options);
  }

  async download(
    path: string,
    {type, onUploadProgress, onDownloadProgress}: RequestOptions = {},
  ): Promise<string> {
    let url = Url.resolve(RESOURCE_BASE_URL, path);

    let response = await axios({
      method: 'get',
      url,
      withCredentials: true,
      headers: {
        'Content-Type': type,
      },
      onUploadProgress,
      onDownloadProgress,
    });

    let result = response.data;

    if (typeof result === 'object' && 'error' in result) {
      let {code, message} = result.error;

      throw new APIErrorException(code, errorMessageToLocalize(code, message));
    }

    return response.data;
  }

  addMiddleware(middleware: APIMiddleware): void {
    this.middlewares.push(middleware);
  }

  private async executeMiddlewares(result: APIResult): Promise<APIResult> {
    let middlewares = this.middlewares.slice();

    let next = async (): Promise<void> => {
      let middleware = middlewares.pop();
      if (middleware) {
        await middleware(result, next);
      }
    };

    await next();

    return result;
  }
}
