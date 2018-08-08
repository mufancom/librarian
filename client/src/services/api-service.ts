import axios from 'axios';
import * as Url from 'url';
import {translation} from 'utils/lang';

const API_BASE_URL = 'http://localhost:3002/';

export const API_UNKNOWN_ERROR = '网络错误';

export function fetchErrorMessage(error: any) {
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

type APIResult = APISuccessResult | APIErrorResult | APIRedirectionResult;

export type OnProgress = (event: ProgressEvent) => void;

export interface APICallOptions {
  type?: string;
  onUploadProgress?: OnProgress;
  onDownloadProgress?: OnProgress;
}

function errorMessageToLocalize(_code: string, _message: string) {
  const message = _message.toLowerCase().replace(/\_(\w)/g, (_all, letter) => {
    return letter.toUpperCase();
  });

  if (translation.hasOwnProperty(message)) {
    return translation[message];
  }
  return _message;
}

export class APIService {
  async call<T>(
    method: string,
    path: string,
    body?: any,
    {type, onUploadProgress, onDownloadProgress}: APICallOptions = {},
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
      // tslint:disable-next-line:no-console
      console.log(error);
    }

    if (!response) {
      throw undefined;
    }

    let result = response.data as APIResult;

    if ('location' in result) {
      window.location.href = result.location;
      // Unreachable
      throw undefined;
    } else if ('error' in result) {
      let {code, message} = result.error;

      throw new APIErrorException(code, errorMessageToLocalize(
        code,
        message,
      ) as string);
    } else {
      return result.data;
    }
  }

  get<T>(url: string, data?: Dict<any>, options?: APICallOptions): Promise<T> {
    return this.call<T>('get', url, data, options);
  }

  post<T>(url: string, data?: Dict<any>, options?: APICallOptions): Promise<T> {
    return this.call<T>('post', url, data, options);
  }
}
