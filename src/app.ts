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
import {ChatBuilder, KnownChatType, MentionContent, ReplyContent} from "node-kakao";
import {MARKET_RESPONSE, getBtcPrice, getCommand, ticker} from "./util/upbit";

/////////////////////////////////////////////////////////////////////
//
//  CONSTS
//
const CHANNEL_ID_ME: number = parseInt(process.env.CHANNEL_ID_ME || "0");

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

CLIENT.on("chat", async (data, channel) => {
  // if (channel.channelId.toNumber() == CHANNEL_ID_ME) {
  // 채널로 구분할 필요는 없을듯, 봇이 해당 채널에 추가되어 있는지를 판별하면 될듯    
  // }

  const sender = data.getSenderInfo(channel);
    if(!sender){
      return;
    }
    
    // 커맨드 추출
    let cmd = getCommand(data.text);
    if(cmd.valid){

      // TODO : 커맨드별 카테고리 추가 필요 
      // MARKET_COMMAND.category 또한 command-helper 같은 class 또는 interface 가 필요할 듯
      // 구분 - 분류 - 작업 수행 이런 단계로 진행
      let message:MARKET_RESPONSE[] = await ticker(cmd.market);
      
      channel.sendChat(
        new ChatBuilder()
        .append(new ReplyContent(data.chat))
        // .append(new MentionContent(sender))
        .text(`${cmd.token}의 현재 가격은 ${getBtcPrice(message)} 원 입니다.`)
        .build(KnownChatType.REPLY));
    }
});
