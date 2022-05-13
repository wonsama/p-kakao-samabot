import {
  ChatBuilder,
  KnownChatType,
  MentionContent,
  TalkChannel,
  TalkChatData,
} from "node-kakao";
import { CommandInterface } from "../commander";

export class RssHelp implements CommandInterface {
  #data: TalkChatData;
  #channel: TalkChannel;

  constructor(data: TalkChatData, channel: TalkChannel) {
    this.#data = data;
    this.#channel = channel;
  }

  async execute(): Promise<void> {
    let news_id = [
      "1 : 코인니스",
      "2 : 코인데스크코리아",
      "3 : 토큰포스트",
      "4 : 코인리더스",
    ];
    let buf = [];
    buf.push(`명령을 확인 바랍니다.`);
    buf.push(`/n [news_id]`);
    buf.push(`예제) /n 1`);
    buf.push(" ");
    buf.push(`★ news_id 목록 ★`);
    buf.push(" ");
    buf.push(news_id.join("\n"));

    let prefix = "님에게 답장 : 도움말\n \n";
    let text = buf.join("\n");

    // SEND REPLY
    const sender = this.#data.getSenderInfo(this.#channel);
    if (sender != undefined) {
      this.#channel.sendChat(
        new ChatBuilder()
          .append(new MentionContent(sender))
          .text(prefix + text)
          .build(KnownChatType.TEXT)
      );
    }
  }
}
