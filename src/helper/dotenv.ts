/*
    FILE : dotenv.helper.ts 
    TITLE : dotenv 도우미 
    CREATED : 2022.05.11
*/

/////////////////////////////////////////////////////////////////////
//
//  IMPORTS
//
import "dotenv/config";

import path from "path";
import fs from "fs";
import os from "os";

/////////////////////////////////////////////////////////////////////
//
//  CONSTS
//
const ENV_FILE_PATH = path.resolve(__dirname, "../../", ".env");

/////////////////////////////////////////////////////////////////////
//
//  VARIABLES
//

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
//  EXPORTS FUNCTIONS
//

// /**
//  * .env 값을 반환한다
//  * 값이 envSave에 의해 수정된 경우에만 아래 메소드 사용
//  * @param key 키
//  * @returns 값
//  */
// export function load(key: string): string | null {
//   const matchedLine = readEnv().find((line) => line.split("=")[0] === key);
//   return matchedLine !== undefined ? matchedLine.split("=")[1] : null;
// }

// /**
//  * .env 값을 설정한다
//  * const 값을 update 처리 해야 됨에 유의
//  * @param key 키
//  * @param value 값

//  */
// export function save(key: string, value: string) {
//   const envVars = readEnv();
//   const targetLine = envVars.find((line) => line.split("=")[0] === key);
//   if (targetLine !== undefined) {
//     // 값 갱신
//     const targetLineIndex = envVars.indexOf(targetLine);
//     envVars.splice(targetLineIndex, 1, `${key}="${value}"`);
//   } else {
//     // 값 신규
//     envVars.push(`${key}="${value}"`);
//   }
//   // 값 기록
//   fs.writeFileSync(ENV_FILE_PATH, envVars.join(os.EOL));
// }

export default function (arr: KeyValue[]) {
  // 파일이 없는 경우 .env 파일을 생성
  if (!fs.existsSync(ENV_FILE_PATH)) {
    fs.closeSync(fs.openSync(ENV_FILE_PATH, "w"));
  }

  let buffer = [];
  for (let line of arr) {
    buffer.push(`${line.key}=${line.value}`);
  }
  fs.writeFileSync(ENV_FILE_PATH, buffer.join(os.EOL));
}

export interface KeyValue {
  key: string;
  value: string;
}
