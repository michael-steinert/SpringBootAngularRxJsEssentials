import { Status } from '../enumeration/status.enum';

export interface Server {
  id: number;
  ipAddress: string;
  name: string;
  memory: string;
  type: string;
  imageUri: string;
  status: Status;
}
