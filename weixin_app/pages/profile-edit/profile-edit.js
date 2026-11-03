const { ME, BG_PRESETS } = require("../../data/me.js");

function hsl2hex(h, s, l) {
  s /= 100; l /= 100;
  const k = n => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = n => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  const to = x => Math.round(255 * x).toString(16).padStart(2, "0");
  return "#" + to(f(0)) + to(f(8)) + to(f(4));
}
function hex2hsl(hex) {
  const r = parseInt(hex.slice(1, 3), 16) / 255, g = parseInt(hex.slice(3, 5), 16) / 255, b = parseInt(hex.slice(5, 7), 16) / 255;
  const mx = Math.max(r, g, b), mn = Math.min(r, g, b), d = mx - mn;
  let h = 0;
  if (d) {
    if (mx === r) h = ((g - b) / d + (g < b ? 6 : 0)) * 60;
    else if (mx === g) h = ((b - r) / d + 2) * 60;
    else h = ((r - g) / d + 4) * 60;
  }
  const l = (mx + mn) / 2;
  return [Math.round(h), Math.round(l * 100)];
}
const grad = (h, l) => "linear-gradient(to right," + hsl2hex(h, 60, 20) + "," + hsl2hex(h, 60, 65) + ")";

Page({
  data: {
    sb: 52,
    name: "",
    ch: "林",
    avatarUrl: "",
    bio: "",
    bg: "#175A67",
    bgUrl: "",
    bgPresets: BG_PRESETS,
    hue: 189, light: 25,
    lightGrad: grad(189, 25),
    focus: "",
    saving: false,
    toastShow: false,
    toastMsg: ""
  },
  onLoad() {
    this.setData(Object.assign({ sb: getApp().globalData.sbTop }, this._mePayload()));
  },
  onShow() { this.syncFromME(); },
  _mePayload() {
    return { name: ME.name, ch: ME.ch, avatarUrl: ME.avatarUrl, bio: ME.bio, bg: ME.bg, bgUrl: ME.bgUrl };
  },
  // 值没变就不下发：避免每次返回本页都重渲染一整张表单
  syncFromME() {
    const p = this._mePayload(), d = this.data;
    if (Object.keys(p).some(k => p[k] !== d[k])) this.setData(p);
  },
  changeAvatar() {
    wx.chooseMedia({
      count: 1, mediaType: ["image"],
      success: res => {
        // 原型：本地预览；正式版在此上传后 PATCH /users/me/avatar
        this.setData({ avatarUrl: res.tempFiles[0].tempFilePath });
        ME.avatarUrl = res.tempFiles[0].tempFilePath;
        this._toast("头像已更新");
      }
    });
  },
  changeBgImg() {
    wx.chooseMedia({
      count: 1, mediaType: ["image"],
      success: res => {
        this.setData({ bgUrl: res.tempFiles[0].tempFilePath });
        ME.bgUrl = res.tempFiles[0].tempFilePath;
        this._toast("主页背景已更新");
      }
    });
  },
  clearBgImg() {
    this.setData({ bgUrl: "" });
    ME.bgUrl = "";
  },
  pickBg(e) {
    const c = e.currentTarget.dataset.c;
    const hl = hex2hsl(c);
    this.setData({ bg: c, bgUrl: "", hue: hl[0], light: hl[1], lightGrad: grad(hl[0], hl[1]) });
    ME.bg = c; ME.bgUrl = "";
  },
  onHue(e) {
    const h = e.detail.value;
    const bg = hsl2hex(h, 60, this.data.light);
    this.setData({ hue: h, bg, bgUrl: "", lightGrad: grad(h, this.data.light) });
    ME.bg = bg; ME.bgUrl = "";
  },
  onLight(e) {
    const l = e.detail.value;
    const bg = hsl2hex(this.data.hue, 60, l);
    this.setData({ light: l, bg, bgUrl: "" });
    ME.bg = bg; ME.bgUrl = "";
  },
  onName(e) {
    this.setData({ name: e.detail.value, ch: (e.detail.value || "林")[0] });
    ME.name = e.detail.value; ME.ch = (e.detail.value || "林")[0];
  },
  onBio(e) { this.setData({ bio: e.detail.value }); ME.bio = e.detail.value; },
  onFieldFocus(e) { this.setData({ focus: e.currentTarget.dataset.f }); },
  onFieldBlur() { this.setData({ focus: "" }); },
  save() {
    if (!this.data.name.trim()) { this._toast("昵称不能为空"); return; }
    // 原型：PATCH /users/me/profile + /users/me/avatar
    this.setData({ saving: true });
    const that = this;
    setTimeout(() => {
      that.setData({ saving: false });
      wx.showToast({ title: "资料已保存", icon: "success" });
      setTimeout(() => wx.navigateBack({ fail: () => wx.redirectTo({ url: "/pages/mine/mine" }) }), 800);
    }, 600);
  },
  goBack() { wx.navigateBack({ fail: () => wx.redirectTo({ url: "/pages/mine/mine" }) }); },
  _toast(msg) {
    this.setData({ toastShow: true, toastMsg: msg });
    clearTimeout(this._tt);
    this._tt = setTimeout(() => this.setData({ toastShow: false }), 1600);
  }
});
