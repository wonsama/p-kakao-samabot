import {
  ChatBuilder,
  KnownChatType,
  ReplyContent,
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
} from "../helper/upbit";

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
      let market;
      let buf = [];
      buf.push(`명령을 확인 바랍니다.`);
      buf.push(`/p [token_id]`);
      buf.push(`예제) /p steem`);
      buf.push(" ");
      buf.push(`★ token_id 목록 ★`);
      buf.push(" ");
      buf.push(unique.join(", "));

      text = buf.join("\n");
    } else {
      text = `${info?.korean_name} (${info?.english_name}) ${getBtcPrice(
        prices
      )} 원`;
    }

    // SEND REPLY
    this.#channel.sendChat(
      new ChatBuilder()
        .append(new ReplyContent(this.#data.chat))
        // .append(new MentionContent(sender))
        .text(text)
        .build(KnownChatType.REPLY)
    );
  }
}
