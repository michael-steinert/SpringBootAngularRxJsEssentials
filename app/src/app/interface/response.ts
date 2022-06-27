import { Server } from './server';

export interface Response {
  timeStamp: Date;
  statusCode: number;
  httpStatus: string;
  reason: string;
  message: string;
  developerMessage: string;
  data: { servers?: Server[]; server?: Server };
}
