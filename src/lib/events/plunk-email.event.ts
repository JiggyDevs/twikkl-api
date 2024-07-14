export class SendPlunkEmailEvent {
  from?: string;
  to: string;
  subject: string;
  body: string;
  subscribed?: boolean;
  name?: any;
  headers?: any;
}

export interface EMAIL_PAYLOAD_TYPE extends SendPlunkEmailEvent {}
