import {
  ChannelUserInfo,
  ChatBuilder,
  KnownChatType,
  MentionContent,
  TalkChannel,
  TalkChatData,
} from "node-kakao";
import { CommandInterface } from "../commander";
import { COINNESS, getFeeds, HELP, RssFeed } from "../helper/rss";
import { getFeeds as getFeedsCoinness } from "../helper/rss.coinness";

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
    const sender = this.#data.getSenderInfo(this.#channel);
    if (this.#rss == HELP) {
      replyHelp(this.#channel, this.#data);
    } else {
      replyRss(this.#channel, this.#rss, sender);
    }
  }
}

async function replyHelp(
  channel: TalkChannel,
  data: TalkChatData
): Promise<void> {
  let news_id = [
    "1 : 코인니스",
    "2 : 코인데스크코리아",
    "3 : 토큰포스트",
    "4 : 코인리더스",
  ];
  let buf = [];
  buf.push(`아래 명령을 확인 바랍니다.\n`);
  buf.push(`[news_id]`);
  buf.push(`예제) /n 1`);
  buf.push(" ");
  buf.push(`★ news_id 목록 ★`);
  buf.push(" ");
  buf.push(news_id.join("\n"));

  let prefix = "님에게 답장\n \n";
  let text = buf.join("\n");

  // SEND REPLY
  const sender = data.getSenderInfo(channel);
  if (sender != undefined) {
    channel.sendChat(
      new ChatBuilder()
        .append(new MentionContent(sender))
        .text(prefix + text)
        .build(KnownChatType.TEXT)
    );
  }
}

export async function replyRss(
  channel: TalkChannel,
  rss: RssFeed,
  sender?: ChannelUserInfo
): Promise<void> {
  let feeds;
  if (rss == COINNESS) {
    feeds = await getFeedsCoinness();
  } else {
    feeds = await getFeeds(rss);
  }

  // ! filtering data 필요 시 주석 해제
  // feeds = ori.filter((x) => x.pubDate?.indexOf(date) == 0); // 오늘날짜 기사만 추출
  // if (feeds.length < 10) {
  //   feeds = ori.slice(0, 10); // 최신 10개만 추출
  // }

  let buf = [];
  for (let feed of feeds) {
    buf.push(feed.title);
    if (feed.pubDate) {
      buf.push(feed.pubDate.substring(0, 19)); // 2022-05-13 10:00:00 KST
    } else {
      buf.push(feed.publishAt.substring(0, 19)); // 2022-05-13 10:00:00 KST
    }

    buf.push(feed.link);
    buf.push(" ");
  }

  if (sender != undefined) {
    let prefix = `님에게 답장\n( ${rss.title} 최신뉴스 )\n \n`;
    channel.sendChat(
      new ChatBuilder()
        .append(new MentionContent(sender))
        .text(prefix + buf.join("\n"))
        .build(KnownChatType.TEXT)
    );
  } else {
    let prefix = `${rss.title} 최신뉴스\n \n`;
    channel.sendChat(
      new ChatBuilder()
        .text(`[알림] ${prefix} ${buf.join("\n")}`)
        .build(KnownChatType.TEXT)
    );
  }
}
