const { PUBLISH_CTX, BOUNTY_STEPS } = require("../../data/publish.js");

Page({
  data: {
    sb: 52,
    mode: "post",           // post=发动态 | qa=提问题
    content: "",
    images: [],
    spaces: [],
    topics: [],
    hotTopics: PUBLISH_CTX.hotTopics,
    bounty: 0,
    bountySteps: BOUNTY_STEPS,
    topicInput: "",
    submitting: false,
    toastShow: false,
    toastMsg: ""
  },
  onLoad(options) {
    const mode = options.mode === "qa" ? "qa" : "post";
    this.setData({ sb: getApp().globalData.sbTop, mode, spaces: PUBLISH_CTX.recentSpaces.map(s => Object.assign({}, s, { on: s.k === "algo" })) });
    // 从草稿箱进入：载入对应草稿
    if (options.draftId) {
      const d = (wx.getStorageSync("qd_drafts") || []).find(x => String(x.id) === String(options.draftId));
      if (d) {
        this._draftId = d.id;
        this.setData({ mode: d.mode || mode, content: d.content || "", topics: d.topics || [], bounty: d.bounty || 0, images: d.images || [] });
      }
    }
  },
  onContent(e) { this.setData({ content: e.detail.value }); },
  chooseImg() {
    const left = 9 - this.data.images.length;
    if (left <= 0) { this._toast("最多 9 张"); return; }
    wx.chooseMedia({ count: left, mediaType: ["image"], success: res => {
      this.setData({ images: this.data.images.concat(res.tempFiles.map(f => f.tempFilePath)) });
    }});
  },
  delImg(e) {
    const i = e.currentTarget.dataset.i;
    const images = this.data.images.slice();
    images.splice(i, 1);
    this.setData({ images });
  },
  // 草稿恢复时临时文件可能已失效，加载失败即剔除
  dropImg(e) {
    const i = e.currentTarget.dataset.i;
    const images = this.data.images.slice();
    images.splice(i, 1);
    this.setData({ images });
  },
  toggleSpace(e) {
    const k = e.currentTarget.dataset.k;
    this.setData({ spaces: this.data.spaces.map(s => s.k === k ? Object.assign({}, s, { on: !s.on }) : s) });
  },
  onTopicInput(e) { this.setData({ topicInput: e.detail.value }); },
  addTopic() {
    const v = (this.data.topicInput || "").trim().replace(/^#/, "");
    if (!v) return;
    if (this.data.topics.indexOf(v) >= 0) { this._toast("话题已存在"); return; }
    if (this.data.topics.length >= 3) { this._toast("最多 3 个话题"); return; }
    this.setData({ topics: this.data.topics.concat(v), topicInput: "" });
  },
  addHotTopic(e) {
    const v = e.currentTarget.dataset.t;
    if (this.data.topics.indexOf(v) >= 0) return;
    if (this.data.topics.length >= 3) { this._toast("最多 3 个话题"); return; }
    this.setData({ topics: this.data.topics.concat(v) });
  },
  removeTopic(e) {
    const t = e.currentTarget.dataset.t;
    this.setData({ topics: this.data.topics.filter(x => x !== t) });
  },
  onBounty(e) { this.setData({ bounty: Number(e.currentTarget.dataset.v) }); },
  canSubmit() { return (this.data.content.trim().length > 0 || this.data.images.length > 0) && !this.data.submitting; },
  submit() {
    if (!this.canSubmit()) return;
    this.setData({ submitting: true });
    const that = this;
    // 原型：接 createPost（qa 模式附 bounty 字段）
    setTimeout(() => {
      that.setData({ submitting: false });
      that._dropDraft();
      wx.showToast({ title: that.data.mode === "qa" ? "问题已发布" : "动态已发布", icon: "success" });
      setTimeout(() => wx.navigateBack({ fail: () => wx.redirectTo({ url: "/pages/discover/discover" }) }), 900);
    }, 700);
  },
  // 草稿箱：同一篇草稿多次保存做覆盖，草稿箱页读取同一份存储
  saveDraft() {
    const text = (this.data.content || "").trim();
    if (!text && !this.data.topics.length && !this.data.images.length) { this._toast("还没有可存的内容"); return; }
    const list = wx.getStorageSync("qd_drafts") || [];
    const rec = {
      id: this._draftId || Date.now(),
      mode: this.data.mode,
      content: this.data.content,
      topics: this.data.topics,
      bounty: this.data.bounty,
      images: this.data.images,
      imageCount: this.data.images.length,
      at: Date.now()
    };
    const i = list.findIndex(d => d.id === rec.id);
    if (i >= 0) list.splice(i, 1, rec); else list.unshift(rec);
    wx.setStorageSync("qd_drafts", list);
    this._draftId = rec.id;
    this._toast("已存入草稿箱");
  },
  _dropDraft() {
    if (!this._draftId) return;
    const list = (wx.getStorageSync("qd_drafts") || []).filter(d => d.id !== this._draftId);
    wx.setStorageSync("qd_drafts", list);
    this._draftId = null;
  },
  goBack() { wx.navigateBack({ fail: () => wx.redirectTo({ url: "/pages/discover/discover" }) }); },
  _toast(msg) {
    this.setData({ toastShow: true, toastMsg: msg });
    clearTimeout(this._tt);
    this._tt = setTimeout(() => this.setData({ toastShow: false }), 1600);
  }
});
