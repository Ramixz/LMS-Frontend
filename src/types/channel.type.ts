import { NotificationModuleType } from "../lib/enums/NotificationModuleType";

export interface Config {
  serverName: string;
  port: number;
  tls: string;
  encrytionMethod: string;
  userName: string;
  password: string;
  subjectEmail: string;
  api_token: string;
  plan_id: string;
  token: string;
  baseUrl: string;
  senderSMS: string;
  sms: string;
}

export interface EmailModule {
  _id: {
    $oid: string;
  };
  module: string;
  name: string;
  config: Config;
  status: string;
}

export interface BaseChannel {
  module:NotificationModuleType.EMAIL | NotificationModuleType.SINCH_SMS;
  name: string;
}

export interface SMTPConfig {
  serverName: string;
  port: number;
  tls?: string;
  encrytionMethod?: string;
  userName: string;
  password: string;
  subjectEmail?: string;
}

export interface SMSConfig {
  plan_id: string;
  api_token: string;
  token?: string;
  baseUrl?: string;
  senderSMS?: string;
  sms?: string;
}


export interface CreateSMTPChannel extends BaseChannel {
  module: NotificationModuleType.EMAIL;
  config: SMTPConfig;
}

export interface CreateSMSChannel extends BaseChannel {
  module: NotificationModuleType.SINCH_SMS;
  config: SMSConfig;
}

export type CreateChannelRequest = CreateSMTPChannel | CreateSMSChannel;

export interface CreateChannelResponse {
  message: string;
}
export interface QueryFilter {
  field?: string;
  function?: string;
  value?: string;
  operator?: string; // Optional if not always needed
}

export interface QueryBody {
  query: {
    filter?: QueryFilter[];
    sort?: { field: string; order: string }[];
  };
}


export interface EditChannelRequest{
  id:string;
  data:{}
}



export interface ChannelFormValues {
  module: string;
  name: string;
  config: {
    serverName?: string;
    port?: number;
    tls?: string;
    encryptionMethod?: string;
    userName?: string;
    password?: string;
    subjectEmail?: string;
    plan_id?: string;
    api_token?: string;
    token?: string;
    baseUrl?: string;
    senderSMS?: string;
    sms?: string;
  };
}



export interface DeleteChannelResponse{
  message:string
}
