/*
    FILE : monitor.ts 
    TITLE : 나와의 채팅 모니터링
    CREATED : 2022.05.11
*/

/////////////////////////////////////////////////////////////////////
//
//  IMPORTS
//
import "dotenv/config";

import { CLIENT, login } from "./helper/kakao-login";

import { getExecutor } from "./util/commander";

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
//  PRIVATE FUNCTIONS
//

/////////////////////////////////////////////////////////////////////
//
//  EXPORTS FUNCTIONS
//

/////////////////////////////////////////////////////////////////////
//
//  INIT
//

// EntryPoint
async function init() {
  login();
}

// EntryPoint Call
init().catch((err) => {
  console.log(err);
});

// 1:1 채팅 한정
CLIENT.on("chat", async (data, channel) => {
  // if (channel.channelId.toNumber() == CHANNEL_ID_ME) {
  // 채널로 구분할 필요는 없을듯, 봇이 해당 채널에 추가되어 있는지를 판별하면 될듯
  // }

  const sender = data.getSenderInfo(channel);
  if (!sender) {
    return;
  }

  // 커맨드 추출 및 실행
  let cmd = getExecutor(data, channel);

  if (cmd != null) {
    cmd.execute();
  }
});
