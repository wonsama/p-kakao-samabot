import moment from "moment-timezone";
import {
  ChatBuilder,
  KnownChatType,
  MentionContent,
  TalkChannel,
  TalkChatData,
} from "node-kakao";
import { CommandInterface } from "../commander";
import { getFeeds } from "../helper/coinness";

export class RssCoinness implements CommandInterface {
  #data: TalkChatData;
  #channel: TalkChannel;

  constructor(data: TalkChatData, channel: TalkChannel) {
    this.#data = data;
    this.#channel = channel;
  }

  async execute(): Promise<void> {
    let ori = await getFeeds();

    let feeds = ori;
    let buf = [];
    for (let feed of feeds) {
      buf.push(feed.title);
      buf.push(
        moment(feed.publishAt).tz("Asia/Seoul").format("yyyy-MM-DD HH:mm:ss")
      );
      buf.push(feed.link);
      buf.push(" ");
    }

    let prefix = "님에게 답장 코인니스 최신뉴스\n \n";
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
