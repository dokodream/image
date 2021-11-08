import { CronJob } from "cron"; /**引入定时事务包 */
import * as moment from "moment"; /**引入日期处理包 */
import axios from "axios"; /**引入网络请求包 */
import * as crypto from "crypto"; /**引入加密包 */

/**加密函数 */
const hash = (method: string, s: string) => {
  var sum = crypto.createHash(method);
  sum.update(s, "utf8");
  return sum.digest("hex");
};

/**定义每周五18:00推送的cron字符串 */
const everyFirDayCron = "00 00 18 * * 5";

/**定义每月十五号18:00推送的cron字符串 */
const every15thCron = "00 00 18 15 * *";

/**定义ERP到期附件每日定时提醒的cron字符串 */
const everyDayForErp = "00 00 07 * * *";

/**获取网络请求key ----时间可能会有毫秒级差错，因此先写成1800固定值*/
const requestKey = (): string => hash("md5", "100200");

/**定义每天推送的事务 */
const everyDayJob = new CronJob(
  everyDayForErp,
  async () => {
    try {
      console.log("每天推送");
      await axios.post(
        "http://192.168.0.21/Hander/WeChatPush/ExpirationReminder.ashx",
        {
          key: "100200",
        }
      );
    } catch (error) {
      console.log(error);
    }
  },
  null,
  true,
  "Asia/Shanghai"
);

console.log("下次每天推送的事务时间");
console.log(everyDayJob.nextDates());


// /**定义每周五推送的事务 */
// const everyFirDayJob = new CronJob(
//   everyFirDayCron,
//   // "00 07 13 * * *",
//   async () => {
//     try {
//       console.log("每周五推送");
//       await axios.post(
//         "http://erp.systech.com.cn/Hander/WeChatPush/ReportForms.ashx",
//         {
//           param: "week",
//           key: "100200",
//         }
//       );
//     } catch (error) {
//       console.log(error);
//     }
//   },
//   null,
//   true,
//   "Asia/Shanghai"
// );

// /**定义每月15号推送的事务 */
// const every15thJob = new CronJob(
//   every15thCron,
//   // "30 05 13 * * *",
//   async () => {
//     try {
//       console.log("每月15号推送");
//       await axios.post(
//         "http://erp.systech.com.cn/Hander/WeChatPush/ReportForms.ashx",
//         {
//           param: "middleOfMonth",
//           key: "100200",
//         }
//       );
//     } catch (error) {
//       console.log(error);
//     }
//   },
//   null,
//   true,
//   "Asia/Shanghai"
// );
// console.log("下次周五推送时间");
// console.log(everyFirDayJob.nextDate());
// console.log("下次15号推送时间");
// console.log(every15thJob.nextDate());

// /**
//  * 开始月底推送事务
//  * @param {boolean} init 定义是否初次加载Flag
//  * 如果初次加载则采用本月月底
//  * 如果程序再次加载使用下月月底
//  */
// const everyEndOfMonthJob = (init: Boolean = false): CronJob => {
//   /**定义月底推送的moment对象 */
//   const pushMoment = init
//     ? moment().endOf("month").hours(17)
//     : moment().add(1, "M").endOf("month").hours(17);
//   /**定义推送的Cron实例 */
//   const nextMonthCronJob = new CronJob(
//     pushMoment,
//     // "10 06 13 * * *",
//     async function () {
//       try {
//         await axios.post(
//           "http://erp.systech.com.cn/Hander/WeChatPush/ReportForms.ashx",
//           {
//             param: "endOfMonth",
//             key: "100200",
//           }
//         );
//         this.stop();
//       } catch (error) {
//         console.log(error);
//       }
//     },
//     function () {
//       console.log("Done");
//       everyEndOfMonthJob();
//     },
//     true /**这个值设为true，则不需要调用job.start()来开始事务 */,
//     "Asia/Shanghai"
//   );
//   console.log("下次月底推送时间");
//   console.log(nextMonthCronJob.nextDate());
//   return nextMonthCronJob;
// };

// /**添加参数用于确定首次渲染 */
// everyEndOfMonthJob(true);
// import * as fs from "fs";
// import * as NodeRSA from "node-rsa";

// /**加载私钥 */
// const prvKey = fs.readFileSync("./pri.pem", "utf8");
// /**加载公钥 */
// const pubKey = fs.readFileSync("./pub.pem", "utf8");

// // 生成 A 的公私钥对象
// const a_public_key = new NodeRSA(pubKey);
// const a_private_key = new NodeRSA(prvKey);

// const text = "你好";
// const encrypted = a_public_key.encrypt(text, "base64");
// console.log("加密后的: ", encrypted);
// const decrypted = a_private_key.decrypt("oO9SFdEpD8KsFmk7zXBlBOnqS6tv8IEE0Jlrlgep0kwv4akirKbsz+kJskTMCt0dylPbZ03ac8oTw2hNTCdMSKlY4QilwWmk4aGvBRdfvqOx20Pq2f2dPcRn+Omd3VVA1LZBDKOagHAmn3ObYj3ctjTIK3X6woYqY5ypq0FoBrE=", "utf8");
// console.log("解密为: ", decrypted);

// // const message = moment().format("YYYYMMDD") + "adsjkhf";
// const message = "你好";

// // 使用公钥加密:
// const encByPub = crypto.publicEncrypt(pubKey, Buffer.from(message, "utf8"));
// console.log("encrypted by public key: " + encByPub.toString("hex"));

// // 使用私钥解密:
// const devByPrv = crypto.privateDecrypt(prvKey, encByPub);
// console.log("decrypted by private key: " + devByPrv.toString("utf8"));
