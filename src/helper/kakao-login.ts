/*
    FILE : 
      kakao-login.ts 
    TITLE : 
      로그인 처리를 수행한다
    CREATED : 
      2022.05.11
*/

/////////////////////////////////////////////////////////////////////
//
//  IMPORTS
//
import "dotenv/config";
import {
  AuthApiClient,
  TalkChannel,
  TalkClient,
  TalkNormalChannel,
} from "node-kakao";
/////////////////////////////////////////////////////////////////////
//
//  CONSTS
//
const EMAIL = (process.env["EMAIL"] as string) || "";
const PASSWORD = (process.env["PASSWORD"] as string) || "";
const DEVICE_UUID = (process.env["DEVICE_UUID"] as string) || "";
const DEVICE_NAME = (process.env["DEVICE_NAME"] as string) || "kakao-bot";

/////////////////////////////////////////////////////////////////////
//
//  VARIABLES
//
let _channel: TalkChannel; // TalkNormalChannel

/////////////////////////////////////////////////////////////////////
//
//  DEFAULTS
//

/////////////////////////////////////////////////////////////////////
//
//  PRIVATE FUNCTIONS
//

/////////////////////////////////////////////////////////////////////
//
//  EXPORTS
//
export const CLIENT = new TalkClient();

export async function login() {
  const api = await AuthApiClient.create(DEVICE_NAME, DEVICE_UUID);

  const loginRes = await api.login({ email: EMAIL, password: PASSWORD }, true);
  if (!loginRes.success) {
    throw new Error(`Web login failed with status: ${loginRes.status}`);
  }
  // console.log(`Received access token: ${loginRes.result.accessToken}`);

  const res = await CLIENT.login(loginRes.result);
  if (!res.success) throw new Error(`Login failed with status: ${res.status}`);

  console.log(`${DEVICE_NAME} login success`);
}

export function setSamabotChat(channel: TalkChannel): void {
  _channel = channel;
}

export function getSamabotChat(): TalkChannel {
  return _channel;
}
/////////////////////////////////////////////////////////////////////
//
//  INIT
//
