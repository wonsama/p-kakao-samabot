module.exports = {
  apps: [
    {
      name: "kakao-samabot" /* PM2 앱 이름 */,
      script: "./bin/app.js" /* 실행 스크립트 */,
      log_date_format: "YYYY-MM-DD HH:mm:ss" /* 로그 형식 */,
      // exp_backoff_restart_delay: 3000 /* 재실행 딜레이 ms */,
      //   cron_restart: "0 0 * * *", /* 크론탭 강제 재실행 설정 */
    },
  ],
};
