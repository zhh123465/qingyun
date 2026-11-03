// 问答详情——原型 QAS 逐字迁移
const { AVATARS } = require("../../data/media.js");

const QAS = {
  zhuan: { tag: "求助", title: "大一转专业到会计，现在准备来得及吗？",
    asker: { ch: "苏", bg: "#EDEFF2", fg: "#5C6B64", avatarUrl: AVATARS.su, name: "苏墨", meta: "经济学院 · 3 小时前" },
    body: "计算机大类大一，对写代码实在提不起兴趣，反倒是对财务报表挺着迷。转专业窗口还开着，现在补先修课来得及吗？会不会跟不上？",
    stats: ["12 个回答", "1.2k 浏览"],
    answers: [
      { ch: "李", bg: "#DCE9E9", fg: "#0F454F", avatarUrl: AVATARS.li, name: "李想", meta: "会计学院 · 大三", pick: "采纳", text: "来得及，我就是大二转过来的。补两门先修课（基础会计 + 微观经济学），暑假看了网课，开学完全跟得上。关键是这学期绩点别掉——转专业主要看大一成绩。", acts: ["486 赞", "36 评论", "收藏"] },
      { ch: "郑", bg: "#FFF3DC", fg: "#B26A00", avatarUrl: AVATARS.zheng, name: "郑雨桐", meta: "会计学院 · 大二", pick: "", text: "建议先去旁听一节中级会计再决定，确认是真的感兴趣而不是想象中喜欢。", acts: ["92 赞", "8 评论"] }
    ] },
  xiandian: { tag: "经验", title: "宿舍限电 800W，台式机到底能不能带？",
    asker: { ch: "李", bg: "#DCE9E9", fg: "#0F454F", avatarUrl: AVATARS.li, name: "李想", meta: "计算机学院 · 昨天" },
    body: "配了台 600W 电源的主机，实际游戏功耗大概 300W，会不会跳闸？有经验的学长学姐说说。",
    stats: ["38 个回答", "2.6k 浏览"],
    answers: [
      { ch: "王", bg: "#E9EBFA", fg: "#3641C4", avatarUrl: AVATARS.wang, name: "王立", meta: "电气学院 · 研二", pick: "优质", text: "看实际功率不看电源额定。300W 整机 + 显示器 40W 完全没问题，我们宿舍 4 台主机同时开都没跳过。真正的杀手是电吹风（1500W）和热水壶。", acts: ["1.2k 赞", "104 评论", "收藏"] },
      { ch: "陈", bg: "#DCE9E9", fg: "#0F454F", avatarUrl: AVATARS.chen, name: "陈思远", meta: "计算机学院 · 大三", pick: "", text: "实测半年没跳过闸，冬天同时开暖气煮火锅才会。", acts: ["156 赞", "12 评论"] }
    ] }
};

Page({
  data: {
    sb: 52,
    navHide: false, kbH: 0, replyName: "", replyFocus: false, q: null, followed: false, draft: "", toastShow: false, toastMsg: "" },
  onLoad(options) {
    this.setData({ sb: getApp().globalData.sbTop });
    this.setData({ q: this._mapAnswers(QAS[options.key || "zhuan"]) });
  },
  onKb(e) { this.setData({ kbH: e.detail.height || 0 }); },
  _mapAnswers(q) {
    q.answers = q.answers.map((a, idx) => {
      const zan = this._parseNum(a.acts[0]);
      const cmt = a.acts[1] ? this._parseNum(a.acts[1]) : 0;
      // 入场延迟档位在数据里算好：模板里不写三元表达式，省得模板解析和肉眼都要绕一遍
      const i = idx + 3 > 7 ? 7 : idx + 3;
      return Object.assign({}, a, { i, zan, cmt, zanOn: false, favOn: false, hasFav: a.acts.indexOf("收藏") >= 0 });
    });
    return q;
  },
  _parseNum(s) {
    const m = /([\d.]+)\s*k/i.exec(s || "");
    if (m) return Math.round(parseFloat(m[1]) * 1000);
    const d = /\d+/.exec(s || "");
    return d ? parseInt(d[0], 10) : 0;
  },
  onZan(e) {
    const i = e.currentTarget.dataset.i;
    const on = !this.data.q.answers[i].zanOn;
    this.setData({ ["q.answers[" + i + "].zanOn"]: on, ["q.answers[" + i + "].zan"]: this.data.q.answers[i].zan + (on ? 1 : -1) });
  },
  onFav(e) {
    const i = e.currentTarget.dataset.i;
    this.setData({ ["q.answers[" + i + "].favOn"]: !this.data.q.answers[i].favOn });
  },
  onCmt(e) {
    const i = e.currentTarget.dataset.i;
    this.setData({ replyName: this.data.q.answers[i].name, replyFocus: true });
    setTimeout(() => this.setData({ replyFocus: false }), 400);
  },
  onPageSc(e) {
    const st = e.detail.scrollTop;
    const last = this._lastSt || 0;
    if (Math.abs(st - last) < 2) return;
    this._lastSt = st;
    // 只有 nav-hide 真的翻转才下发：滚动中每帧 setData 会让样式重算跑满 60fps
    const hide = st > 80 && st > last;
    if (hide !== this.data.navHide) this.setData({ navHide: hide });
  },
  goBack() { wx.navigateBack({ fail: () => wx.redirectTo({ url: "/pages/discover/discover" }) }); },
  toggleFollow() {
    this.setData({ followed: !this.data.followed });
    this._toast(this.data.followed ? "已关注该问题" : "已取消关注");
  },
  onDraft(e) { this.setData({ draft: e.detail.value }); },
  // 回答就地追加到列表顶部下方，并同步回答计数
  publish() {
    const v = (this.data.draft || "").trim();
    if (!v) { this._toast("先写下你的回答"); return; }
    const q = Object.assign({}, this.data.q);
    q.answers = [{ ch: "林", bg: "#175A67", fg: "#FFFFFF", avatarUrl: AVATARS.lin, i: 3, name: "林青云", meta: "计算机学院 · 刚刚", pick: "", text: (this.data.replyName ? "「回复 @" + this.data.replyName + "」" : "") + v, zan: 0, cmt: 0, zanOn: false, favOn: false, hasFav: true }].concat(q.answers);
    q.stats = [(q.answers.length) + " 个回答", q.stats[1]];
    this.setData({ q, draft: "", replyName: "" });
    this._toast("回答已发布");
  },
  tip(e) { this._toast(e.currentTarget.dataset.t); },
  _toast(msg) {
    this.setData({ toastShow: true, toastMsg: msg });
    clearTimeout(this._tt);
    this._tt = setTimeout(() => this.setData({ toastShow: false }), 1600);
  }
});
