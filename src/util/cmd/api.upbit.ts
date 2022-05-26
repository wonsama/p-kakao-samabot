import {
  ChatBuilder,
  KnownChatType,
  MentionContent,
  TalkChannel,
  TalkChatData,
} from "node-kakao";
import { CommandInterface, Command, getCommand } from "../commander";
import {
  getBtcPrice,
  MARKET_RESPONSE,
  ticker,
  findMarket,
  MARKET_INFO,
  getMarketJson,
  tickerFixed,
} from "../helper/upbit";

import moment from "moment-timezone";
import { getSamabotChat } from "../../helper/kakao-login";

export class Upbit implements CommandInterface {
  #data: TalkChatData;
  #channel: TalkChannel;

  constructor(data: TalkChatData, channel: TalkChannel) {
    this.#data = data;
    this.#channel = channel;
  }

  async execute(): Promise<void> {
    let cmd: Command = getCommand(this.#data.text);
    let symbol = cmd.message.trim();

    // top10 추가
    if (symbol == "top") {
      top5(this.#channel);
      return;
    }

    let prices: MARKET_RESPONSE[] = await ticker(symbol);
    let info: MARKET_INFO | null = findMarket(symbol);

    let text: string = "";
    let items = getMarketJson()
      .filter(
        (x) => x.market.indexOf("BTC") == 0 || x.market.indexOf("KRW") == 0
      )
      .map((x) => x.market.substring(4));
    let unique = [...new Set(items)];
    unique.sort();
    if (info == null) {
      let buf = [];
      buf.push(`아래 명령을 확인 바랍니다.`);
      buf.push(`/p [token_id]`);
      buf.push(`예제) /p steem`);
      buf.push(`예제) /p top`);
      buf.push(" ");
      buf.push(`★ token_id 목록 ★`);
      buf.push(" ");
      buf.push(unique.join(", "));

      text = buf.join("\n");
    } else {
      // text = `${info?.korean_name} (${info?.english_name}) ${getBtcPrice(
      //   prices
      // )} 원`;

      let price = prices[1];
      text = `${info?.korean_name} (${info?.english_name}) \n L ${
        price.change == "RISE" ? "🔴" : price.change == "FALL" ? "🔵" : "⚪"
      } ${getBtcPrice(prices).toLocaleString(undefined, {
        // minimumFractionDigits: 2,
      })} 원 (${
        price.change == "RISE" ? "+" : price.change == "FALL" ? "-" : ""
      }${(price.change_rate * 100).toFixed(2)}%)`;
    }

    // SEND REPLY
    const sender = this.#data.getSenderInfo(this.#channel);
    if (sender != undefined) {
      this.#channel.sendChat(
        new ChatBuilder()
          .append(new MentionContent(sender))
          .text(
            "님에게 답장\n" +
              `( ${moment
                .tz("Asia/Seoul")
                .format("yy.MM.DD HH:mm:ss")} )\n \n` +
              text
          )
          .build(KnownChatType.TEXT)
      );
    }

    // 오픈 채팅방에서는 동작하지 않음 - reply 가 text 임 대신 attachment 가 있음
    // new ChatBuilder()
    // .append(new ReplyContent(this.#data.chat))
    // this.#channel.sendChat("!23");
  }
}

export async function scheduledPriceChat(channel: TalkChannel): Promise<void> {
  let markets = "KRW-BTC,KRW-STEEM,KRW-SBD,KRW-TRX"; // 가격 변환을 위해 맨 앞은 비트코인 필수
  let prices: MARKET_RESPONSE[] = await tickerFixed(markets);

  let buf = [];
  buf.push(`${moment.tz("Asia/Seoul").format("yyyy-MM-DD HH:mm:ss")}`);
  buf.push(` `);
  for (let price of prices) {
    let info: MARKET_INFO | null = findMarket(price.market.substring(4));
    let temp: MARKET_RESPONSE[] = [prices[0], price];

    buf.push(
      `${info?.korean_name} (${info?.english_name}) \n L ${
        price.change == "RISE" ? "🔴" : price.change == "FALL" ? "🔵" : "⚪"
      } ${getBtcPrice(temp).toLocaleString(undefined, {
        // minimumFractionDigits: 2,
      })} 원 (${
        price.change == "RISE" ? "+" : price.change == "FALL" ? "-" : ""
      }${(price.change_rate * 100).toFixed(2)}%)`
    );
  }

  channel.sendChat(
    new ChatBuilder().text(`[알림] ${buf.join("\n")}`).build(KnownChatType.TEXT)
  );
}

export async function top5(channel: TalkChannel): Promise<void> {
  try {
    let markets = getMarketJson()
      .filter((x) => x.market.indexOf("KRW") == 0)
      .map((x) => x.market)
      .join(",");

    let prices: MARKET_RESPONSE[] = await tickerFixed(markets);
    let btcPrice = prices.filter((x) => x.market == "KRW-BTC")[0]; // 무조건 있음

    let buf = [];
    buf.push(`${moment.tz("Asia/Seoul").format("yy.MM.DD HH:mm:ss")}`);
    buf.push(` `);

    // TOP 5, DOWN 5 필터링
    prices.sort((a, b) => b.signed_change_rate - a.signed_change_rate);
    let rise = prices.slice(0, 5);
    prices.reverse();
    let fall = prices.slice(0, 5);

    buf.push(`TOP 5`);
    buf.push(` `);
    for (let price of rise) {
      let info: MARKET_INFO | null = findMarket(price.market.substring(4));
      let temp: MARKET_RESPONSE[] = [btcPrice, price];

      buf.push(
        `${info?.korean_name} (${info?.english_name}) \n L ${
          price.change == "RISE" ? "🔴" : price.change == "FALL" ? "🔵" : "⚪"
        } ${getBtcPrice(temp).toLocaleString(undefined, {
          // minimumFractionDigits: 2,
        })} 원 (${
          price.change == "RISE" ? "+" : price.change == "FALL" ? "-" : ""
        }${(price.change_rate * 100).toFixed(2)}%)`
      );
    }

    buf.push(` `);
    buf.push(`DOWN 5`);
    buf.push(` `);
    for (let price of fall) {
      let info: MARKET_INFO | null = findMarket(price.market.substring(4));
      let temp: MARKET_RESPONSE[] = [btcPrice, price];

      buf.push(
        `${info?.korean_name} (${info?.english_name}) \n L ${
          price.change == "RISE" ? "🔴" : price.change == "FALL" ? "🔵" : "⚪"
        } ${getBtcPrice(temp).toLocaleString(undefined, {
          // minimumFractionDigits: 2,
        })} 원 (${
          price.change == "RISE" ? "+" : price.change == "FALL" ? "-" : ""
        }${(price.change_rate * 100).toFixed(2)}%)`
      );
    }

    channel.sendChat(
      new ChatBuilder()
        .text(`[알림] ${buf.join("\n")}`)
        .build(KnownChatType.TEXT)
    );
  } catch (err) {
    console.log(`[top5] ${err}`);
  }
}
