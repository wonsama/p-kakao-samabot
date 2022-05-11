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

/////////////////////////////////////////////////////////////////////
//
//  CONSTS
//
const UPBIT_API_URL_PREFIX = "https://api.upbit.com/v1";

/////////////////////////////////////////////////////////////////////
//
//  VARIABLES
//

/////////////////////////////////////////////////////////////////////
//
//  DEFAULTS
//
const instance = axios.create({
  baseURL: UPBIT_API_URL_PREFIX,
  timeout: 1000
});

/////////////////////////////////////////////////////////////////////
//
//  TYPES
//

// type MARKET = JSON["parse"](fs.readFileSync("./util/upbit/markets.json", "utf8")).split("|");

export type MARKET_RESPONSE = {
  market: string,
  trade_date: string,
  trade_time: string,
  trade_date_kst: string,
  trade_time_kst: string,
  trade_timestamp: number,
  opening_price: number,
  high_price: number,
  low_price: number,
  trade_price: number,
  prev_closing_price: number,
  change: string,
  change_price: number,
  change_rate: number,
  signed_change_price: number,
  signed_change_rate: number,
  trade_volume: number,
  acc_trade_price: number,
  acc_trade_price_24h: number,
  acc_trade_volume: number,
  acc_trade_volume_24h: number,
  highest_52_week_price: number,
  highest_52_week_date: string,
  lowest_52_week_price: number,
  lowest_52_week_date: string,
  timestamp: number,
}

export type MARKET_INFO = {
  market: string,
  korean_name: string,
  english_name: string,
  market_warning?: boolean,
}

type MARKET_COMMAND = {
  token?: string,
  market: string,
  valid:boolean,
}

/////////////////////////////////////////////////////////////////////
//
//  PRIVATE FUNCTIONS
//

/////////////////////////////////////////////////////////////////////
//
//  EXPORTS FUNCTIONS
//

export function getBtcPrice(res :MARKET_RESPONSE[]):number{
  if(res.length==0){
    return 0;
  }
  let btcPrice = res[0].trade_price;
  let tokenPrice = res[1].trade_price;
  if(res[1].market.indexOf("BTC")==0){
    return Math.floor(tokenPrice*btcPrice);
  }
  // TODO : USDT market 은 무시, 나중에 환율정보를 가져올 수 있으면 그때 다시 생각
  return tokenPrice;
}

export function getCommand(text:string):MARKET_COMMAND{
  const KR_DIR = new Map<string, string>();
  KR_DIR.set("스팀", "KRW-STEEM");
  KR_DIR.set("스달", "KRW-SBD");
  KR_DIR.set("루나", "BTC-LUNA");
    
  let msg = text || "";
  if(msg.indexOf("/")==0){
    let token = msg.substring(1).split(" ")[0];      
    let market = KR_DIR.get(token);
    if(market){
      return {token, market, valid:true};
    }
  }
  return {market:"", valid:false};
}

export async function marketAll(): Promise<MARKET_INFO[]> {
  let res;
  try{
    res = await instance.get(`/market/all`);
    return res.data;
  }catch(err){
    return [];
  }
  // KRW, BTC, USDT
}

export async function ticker(market: string) : Promise<MARKET_RESPONSE[]>{
  let res;
  try{
    res = await instance.get(`/ticker?markets=KRW-BTC,${market}`);
    return res.data;
  }catch(err){
    return [];
  }
}



