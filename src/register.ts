/*
    FILE : register.ts
    TITLE : 카카오톡 기기등록, PC 연결 시 해당 APP은 종료됨에 유의 
    CREATED : 2022.05.11
*/

/////////////////////////////////////////////////////////////////////
//
//  IMPORTS
//
import "dotenv/config";
import { default as dotenvCreate } from "./helper/dotenv";
import { util, AuthApiClient, KnownAuthStatusCode } from "node-kakao";
import { default as input } from "./helper/readline";

/////////////////////////////////////////////////////////////////////
//
//  CONSTS
//
// let EMAIL = (process.env["EMAIL"] as string) || "";
// let PASSWORD = (process.env["PASSWORD"] as string) || "";
// let DEVICE_UUID = (process.env["DEVICE_UUID"] as string) || "";
// let DEVICE_NAME = (process.env["DEVICE_NAME"] as string) || "kakao-bot";
// f718f68cce35986e18a6936c8fb829e5b499253f

/////////////////////////////////////////////////////////////////////
//
//  VARIABLES
//

/////////////////////////////////////////////////////////////////////
//
//  PRIVATE FUNCTIONS
//

/////////////////////////////////////////////////////////////////////
//
//  INIT
//

// EntryPoint
async function init() {
  const email = await input("your kakao talk email : ");
  const password = await input("your kakao talk password : ");
  const DEVICE_UUID = util.randomAndroidSubDeviceUUID();
  const DEVICE_NAME = "kakao-bot";

  // STEP1. 기기등록 로그인 요청
  const api = await AuthApiClient.create(DEVICE_NAME, DEVICE_UUID);
  const form = { email, password };
  const loginRes = await api.login(form, true);
  if (loginRes.success) throw new Error("Device already registered!");
  if (loginRes.status !== KnownAuthStatusCode.DEVICE_NOT_REGISTERED) {
    throw new Error(`Web login failed with status: ${loginRes.status}`);
  }

  // STEP2. 카카오톡에서 신규 기기등록 인증 요청(passcode)
  const passcodeRes = await api.requestPasscode(form);
  if (!passcodeRes.success) {
    throw new Error(
      `Passcode request failed with status: ${passcodeRes.status}`
    );
  }

  // STEP3. 카카오톡 패스코드 입력
  const passcode = await input("your kakao talk passcode : ");
  const registerRes = await api.registerDevice(form, passcode, true);
  if (!registerRes.success) {
    throw new Error(
      `Device registration failed with status: ${registerRes.status}`
    );
  }
  console.log(`Device ${DEVICE_UUID} has been registered`);

  // STEP4. 로그인 테스트
  const loginAfterRes = await api.login(form, true);
  if (!loginAfterRes.success) {
    throw new Error(`Web login failed with status: ${loginAfterRes.status}`);
  }
  console.log(`Client logon successfully`);

  // STEP4. .env 에 값 저장
  dotenvCreate([
    { key: "EMAIL", value: email },
    { key: "PASSWORD", value: password },
    { key: "DEVICE_UUID", value: DEVICE_UUID },
    { key: "DEVICE_NAME", value: DEVICE_NAME },
  ]);
}

// EntryPoint Call
init().catch((err) => {
  console.log(err);
});
