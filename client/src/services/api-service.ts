import axios from 'axios';
import * as Url from 'url';

const API_BASE_URL = 'http://localhost:3002/';

export const APIErrorCode = {
  invalidArguments: 'INVALID_ARGUMENTS',
  validationFailed: 'VALIDATION_FAILED',
  authenticationFailed: 'AUTHENTICATION_FAILED',
  userNotFound: 'USER_NOT_FOUND',
  usernameAlreadyExists: 'USERNAME_ALREADY_EXISTS',
  emailAlreadyExists: 'EMAIL_ALREADY_EXISTS',
  conventionNotFound: 'CONVENTION_NOT_FOUND',
};

export class APIErrorException extends Error {
  constructor(readonly code: string, readonly message: string) {
    super(message);
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

export class APIService {
  async call<T>(
    method: string,
    path: string,
    body?: any,
    {type, onUploadProgress, onDownloadProgress}: APICallOptions = {},
  ): Promise<T> {
    let url = Url.resolve(API_BASE_URL, path);

    let response = await axios({
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

    let result = response.data as APIResult;

    if ('location' in result) {
      window.location.href = result.location;
      // Unreachable
      throw undefined;
    } else if ('error' in result) {
      let error = result.error;
      throw new APIErrorException(error.code, error.message);
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
