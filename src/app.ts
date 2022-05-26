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
import moment from "moment-timezone";

import {
  CLIENT,
  getSamabotChat,
  login,
  setSamabotChat,
} from "./helper/kakao-login";
import { scheduledPriceChat, top5 } from "./util/cmd/api.upbit";
import { replyRss } from "./util/cmd/rss.main";

import { getExecutor } from "./util/commander";
import { COINNESS } from "./util/helper/rss";

/////////////////////////////////////////////////////////////////////
//
//  CONSTS
//
const CHANNEL_ID_ME = parseInt(process.env.CHANNEL_ID_ME || "0");

const SCHEDULED_TXT = process.env.SCHEDULED_TXT || "mm:ss"; // 나중에 크론 스타일로 바꾸기, 그런데 현 시점 기준 딱히 사유는 없음
const SCHEDULED_TIME = process.env.SCHEDULED_TIME || "00:00";

/////////////////////////////////////////////////////////////////////
//
//  VARIABLES
//
let channelInit = false;
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

  // 사마봇과 1:1대화 인 경우에 동작하도록 해당 채널 아이디를 지정
  // 로그인 이후 최초 1회 채널 정보를 업데이트 한다
  // 개별 세션마다 동작하도록 처리 해야 되는데 음 .. 우선 나만 동작하도록

  // CLIENT 가 new 된 시점에서 DirectChat 이 최초 1회 들어온 경우
  // 메모리 상에서 regist 하여 해당 channel 정보를 가지고 있도록 처리

  if (
    !channelInit &&
    channel.info.type == "DirectChat" &&
    channel.channelId.toNumber() == CHANNEL_ID_ME
  ) {
    setSamabotChat(channel);
    console.log(`channel (${channel.channelId}) is saved.`);
    channelInit = true;

    // 주기적으로 메시지 보내기
    setInterval(async function () {
      // 내부 CRON 설정 (사실 비효율적이나 현대 고성능 컴퓨팅에서는 별 무리 없다 생각)()
      // moment.tz("Asia/Seoul").format("yyyy-MM-DD HH:mm:ss");
      if (moment.tz("Asia/Seoul").format(SCHEDULED_TXT) == SCHEDULED_TIME) {
        // 가격 정보 매시간 알려주기
        let channel = getSamabotChat();
        await top5(channel);
        await scheduledPriceChat(channel);
        await replyRss(channel, COINNESS);
      }
    }, 1000 * 1);
  }

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
