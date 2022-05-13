/*
    FILE : 
      rss.ts 
    TITLE : 
      RSS 관련 도우미 
    CREATED : 
      2022.05.13
*/

/////////////////////////////////////////////////////////////////////
//
//  IMPORT
//
import Parser, { Item } from "rss-parser";

/////////////////////////////////////////////////////////////////////
//
//  CONST
//

export const COIN_DESK_KOREA: RssFeed = {
  title: "코인데스크코리아",
  url: "http://www.coindeskkorea.com/rss/allArticle.xml",
};
export const TOKEN_POST: RssFeed = {
  title: "토큰포스트",
  url: "https://www.tokenpost.kr/rss",
};
export const COIN_READERS: RssFeed = {
  title: "코인리더스",
  url: "https://www.coinreaders.com/rss/rss_news.php",
};

/////////////////////////////////////////////////////////////////////
//
//  VARIABLE
//

/////////////////////////////////////////////////////////////////////
//
//  DEFAULT
//

/////////////////////////////////////////////////////////////////////
//
//  TYPE
//
export type RssFeed = {
  title: string;
  url: string;
};

/////////////////////////////////////////////////////////////////////
//
//  INTERFACE
//

/////////////////////////////////////////////////////////////////////
//
//  CLASS
//

/////////////////////////////////////////////////////////////////////
//
//  PRIVATE FUNCTION
//

/////////////////////////////////////////////////////////////////////
//
//  EXPORTS FUNCTION
//
export async function getFeeds(
  rss: RssFeed
): Promise<({ [key: string]: any } & Item)[]> {
  let parser = new Parser();
  const feed = await parser.parseURL(rss.url);
  //   for (let item of feed.items) {
  //     console.log(item.creator);
  //     console.log(item.title);
  //     console.log(item.pubDate);
  //     console.log(item.link);
  //     console.log();
  //     console.log(item.content);
  //     console.log(item.contentSnippet);
  //   }
  return feed.items;
}

/////////////////////////////////////////////////////////////////////
//
//  INIT
//
