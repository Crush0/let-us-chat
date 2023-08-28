import moment from 'moment'
import 'moment/dist/locale/zh-cn'
moment.locale('zh-cn');
export default {
  // 获取联系人的上次聊天时间 转换成 上午9:20 或 昨天 或 星期三 或 2019/11/14
  getLastChatTime(time:any) {
    let curtime = moment();
    let ftime = moment(time);
    const curDate = curtime.format("YYYY-MM-DD");
    const fDate = ftime.format("YYYY-MM-DD")
    if (curDate === fDate) {
      return ftime.format("a h:mm")
    }
    if (this.dateDiff(curDate, fDate) === 1) {
      return '昨天'
    }
    if (this.dateDiff(curDate, fDate) <= 6) {
      return ftime.format("dddd");
    } else {
      return ftime.format("YYYY/M/D");
    }
  },
  // 获取聊天记录中的时间  转换成  上午9:20 或 昨天 上午9:20  或 星期六 上午9:30  或 2019-8-17 上午9：30
  getHistoryChatTime(time:Date) {
    let curtime = moment();
    let ftime = moment(time);
    const curDate = curtime.format("YYYY-MM-DD");
    const fDate = ftime.format("YYYY-MM-DD")
    if (curDate === fDate) {
      return ftime.format("a h:mm")
    }
    if (this.dateDiff(curDate, fDate) === 1) {
      return ftime.format("昨天 ah:mm")
    }
    if (this.dateDiff(curDate, fDate) <= 6) {
      return ftime.format("dddd ah:mm");
    } else {
      return ftime.format("YYYY年M月D日 <br/> ah:mm");
    }
  },
  // 日期差
  dateDiff(sDate1:any, sDate2:any) { //sDate1和sDate2是2019-09-25格式
    let aDate, oDate1:any, oDate2:any, iDays;
    aDate = sDate1.split("-");
    oDate1 = new Date(aDate[1] + '-' + aDate[2] + '-' + aDate[0]);
    aDate = sDate2.split("-");
    oDate2 = new Date(aDate[1] + '-' + aDate[2] + '-' + aDate[0]);
    iDays = parseInt((Math.abs(oDate1 - oDate2) / 1000 / 60 / 60 / 24).toString())
    return iDays;
  },
}
