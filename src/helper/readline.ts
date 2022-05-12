/*
    FILE : 
      readline.ts 
    TITLE : 
      terminal로 부터 값을 입력 받도록 처리
    CREATED : 
      2022.05.11
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

/**
 * 메시지 입력 처리
 * @param message 문의 사항
 * @returns 답변 내용
 */
export function input(message: string): Promise<string> {
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
