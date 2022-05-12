// https://api.upbit.com/v1/ticker?markets=KRW-STEEM

// axios('/user/12345');

/*
    FILE : upbit.ts 
    TITLE : 업비트 관련 API
    CREATED : 2022.05.11
*/

/////////////////////////////////////////////////////////////////////
//
//  IMPORTS
//
import axios from "axios";
import fs from "fs";
import { APP_ROOT } from "../path";

/////////////////////////////////////////////////////////////////////
//
//  CONSTS
//
const UPBIT_API_URL_PREFIX = "https://api.upbit.com/v1";
const MARKET_JSON = `${APP_ROOT}/.market.json`;

/////////////////////////////////////////////////////////////////////
//
//  VARIABLES
//
let marketJson: MARKET_INFO[] = [];

/////////////////////////////////////////////////////////////////////
//
//  DEFAULTS
//
const instance = axios.create({
  baseURL: UPBIT_API_URL_PREFIX,
  timeout: 1000,
});

/////////////////////////////////////////////////////////////////////
//
//  TYPES
//

// type MARKET = JSON["parse"](fs.readFileSync("./util/upbit/markets.json", "utf8")).split("|");

export type MARKET_RESPONSE = {
  market: string;
  trade_date: string;
  trade_time: string;
  trade_date_kst: string;
  trade_time_kst: string;
  trade_timestamp: number;
  opening_price: number;
  high_price: number;
  low_price: number;
  trade_price: number;
  prev_closing_price: number;
  change: string;
  change_price: number;
  change_rate: number;
  signed_change_price: number;
  signed_change_rate: number;
  trade_volume: number;
  acc_trade_price: number;
  acc_trade_price_24h: number;
  acc_trade_volume: number;
  acc_trade_volume_24h: number;
  highest_52_week_price: number;
  highest_52_week_date: string;
  lowest_52_week_price: number;
  lowest_52_week_date: string;
  timestamp: number;
};

export type MARKET_INFO = {
  market: string;
  korean_name: string;
  english_name: string;
  market_warning?: boolean;
};

type MARKET_COMMAND = {
  token?: string;
  market: string;
  valid: boolean;
};

/////////////////////////////////////////////////////////////////////
//
//  PRIVATE FUNCTIONS
//

/**
 * market 정보 파일이 없으면 생성한다
 */
async function init() {
  if (!fs.existsSync(MARKET_JSON)) {
    marketJson = await reloadMarketJson();
  } else {
    marketJson = JSON.parse(fs.readFileSync(MARKET_JSON, "utf-8"));
  }
}
init();

/////////////////////////////////////////////////////////////////////
//
//  EXPORTS FUNCTIONS
//

/**
 * 마켓 목록 정보를 반환한다
 * @returns 마켓 목록정보
 */
export function getMarketJson(): MARKET_INFO[] {
  return marketJson;
}

/**
 * BTC의 경우 KRW-BTC 가격을 환산하여 반환
 * KRW의 경우 원래 가격 반환
 * @param res 시장 가격 정보 (0:BTC-KRW, TOKEN)
 * @returns 가격정보
 */
export function getBtcPrice(res: MARKET_RESPONSE[]): number {
  if (res.length == 0) {
    return 0;
  }
  let btcPrice = res[0].trade_price;
  let tokenPrice = res[1].trade_price;

  if (res[1].market.indexOf("BTC") == 0) {
    return Math.floor(tokenPrice * btcPrice);
  }
  // TODO : USDT market 은 무시, 나중에 환율정보를 가져올 수 있으면 그때 다시 생각
  return tokenPrice;
}

/**
 * 모든 마켓 정보를 생성한다 KRW, BTC, USDT
 * @returns 마켓 정보 생성하여 반환
 */
export async function marketAll(): Promise<MARKET_INFO[]> {
  let res;
  try {
    res = await instance.get(`/market/all`);
    return res.data;
  } catch (err) {
    return [];
  }
}

/**
 * 마켓 심볼정보를 갱신 처리하여 .market.json 에 기록
 * @returns 마켓 심볼정보
 */
export async function reloadMarketJson() {
  let res = await marketAll();
  fs.writeFileSync(MARKET_JSON, JSON.stringify(res, null, 2));
  return res;
}

/**
 * 마켓 정보를 주면 KRW, BTC 순회하면서 가격 정보를 반환
 * KRW를 우선함, 나머지 마켓 무시
 * @param symbol 토큰 심볼
 */
export function findMarket(symbol: string): MARKET_INFO | null {
  let krwArr = marketJson.filter(
    (x) =>
      x.market.indexOf("KRW") == 0 &&
      x.market.substring(4) == symbol.toUpperCase()
  );
  let btcArr = marketJson.filter(
    (x) =>
      x.market.indexOf("BTC") == 0 &&
      x.market.substring(4) == symbol.toUpperCase()
  );

  return krwArr.length == 1 ? krwArr[0] : btcArr.length == 1 ? btcArr[0] : null;
}

/**
 * 현재 마켓 가격 정보를 반환한다
 * @param symbol 토큰 심볼
 * @returns 마켓 가격 [0] : KRW-BTC, [1] KRW or BTC-SYMBOL
 */
export async function ticker(symbol: string): Promise<MARKET_RESPONSE[]> {
  let res;

  // 입력받은 값은 대문자로 ...
  let info = findMarket(symbol);
  if (!info) {
    console.error(`${symbol} is not exist symbol in KRW, BTC market.`);
    return [];
  }

  try {
    // 주의 KRW-BTC,KRW-BTC 이렇게 설정되면 404 오류
    if (info.market == "KRW-BTC") {
      res = await instance.get(`/ticker?markets=KRW-BTC`);
      return [res.data[0], res.data[0]]; // 그래서 1개만 조회하고 2개 같은 값을 넣어준다
    } else {
      res = await instance.get(`/ticker?markets=KRW-BTC,${info.market}`);
      return res.data;
    }
  } catch (err) {
    console.error(`${symbol} error occured`);
    return [];
  }
}
