import {
  ChatBuilder,
  KnownChatType,
  MentionContent,
  TalkChannel,
  TalkChatData,
} from "node-kakao";
import { CommandInterface } from "../commander";
import { getFeeds, RssFeed } from "../helper/rss";

export class RssMain implements CommandInterface {
  #data: TalkChatData;
  #channel: TalkChannel;
  #rss: RssFeed;

  constructor(data: TalkChatData, channel: TalkChannel, rss: RssFeed) {
    this.#data = data;
    this.#channel = channel;
    this.#rss = rss;
  }

  async execute(): Promise<void> {
    let ori = await getFeeds(this.#rss);
    // let date = moment().tz("Asia/Seoul").format("yyyy-MM-DD");
    let feeds = ori;
    // feeds = ori.filter((x) => x.pubDate?.indexOf(date) == 0); // 오늘날짜 기사만 추출
    // if (feeds.length < 10) {
    //   feeds = ori.slice(0, 10); // 최신 10개만 추출
    // }
    let buf = [];
    for (let feed of feeds) {
      buf.push(feed.title);
      buf.push(feed.pubDate?.substring(0, 19)); // 2022-05-13 10:00:00 KST
      buf.push(feed.link);
      buf.push(" ");
    }

    let prefix = `님에게 답장 ${this.#rss.title} 최신뉴스\n \n`;
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
