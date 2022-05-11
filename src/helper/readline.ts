/*
    FILE : readline.ts 
    TITLE : terminal로 부터 값을 입력 받도록 처리
    CREATED : 2022.05.11
*/

/////////////////////////////////////////////////////////////////////
//
//  IMPORTS
//
import * as readline from "readline";

/////////////////////////////////////////////////////////////////////
//
//  CONSTS
//

/////////////////////////////////////////////////////////////////////
//
//  VARIABLES
//

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
export default function (message: string): Promise<string> {
  let rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  rl.setPrompt(message);
  rl.prompt();

  return new Promise((resolve) => {
    rl.on("line", (line) => {
      rl.close();
      resolve(line);
    });
  });
}