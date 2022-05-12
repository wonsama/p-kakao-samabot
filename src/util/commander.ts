/*
    FILE : 
        commander.ts 
    TITLE : 
        커맨더, 
        입력받은 문자열을 분석하여 명령정보 확인이후 
        이에 맞는 것에 명령을 위임하여 처리하도록 한다 
    CREATED : 
        2022.05.12
*/

import { Upbit } from "./cmd/cmd.upbit";
import { TalkChannel, TalkChatData } from "node-kakao";
/////////////////////////////////////////////////////////////////////
//
//  IMPORTS
//

/////////////////////////////////////////////////////////////////////
//
//  CONSTS
//

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
//  TYPE
//

/*
  메시지는 
  /명령 내용 으로 구성
*/
export type Command = {
  readonly cmd?: string; // 명령
  readonly message: string; // 내용
  data?: Object; // 내용 부분을 데이터 화 함. 향후 다른 타입으로 변경 될 수 있음.
  valid: boolean;
};

/////////////////////////////////////////////////////////////////////
//
//  INTERFACE
//
export interface CommandInterface {
  execute(): void;
}

/////////////////////////////////////////////////////////////////////
//
//  CLASS
//

/////////////////////////////////////////////////////////////////////
//
//  PRIVATE FUNCTIONS
//

/////////////////////////////////////////////////////////////////////
//
//  EXPORTS FUNCTIONS
//
export function getCommand(text: string): Command {
  let msg = text || "";
  // 모든 메시지는 대문자화 하여 처리함.
  if (msg.indexOf("/") == 0) {
    let tokens = msg.substring(1).split(" ");
    let cmd = tokens.shift();
    let message = tokens.join(" ");
    return {
      cmd,
      message,
      valid: true,
    };
  }
  return { message: "", valid: false };
}

export function getExecutor(
  data: TalkChatData,
  channel: TalkChannel
): CommandInterface | null {
  let cmd = getCommand(data.text);

  if (cmd.cmd?.toUpperCase() == "P") {
    return new Upbit(data, channel);
  }
  return null;
}

/////////////////////////////////////////////////////////////////////
//
//  INIT
//
