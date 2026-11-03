// ===== 当前登录用户（编辑资料的数据接口） =====
// 换头像：avatarUrl 填网络图片地址（为空显示 ch 字母占位）
// 换主页背景：bg 填颜色值，或 bgUrl 填图片地址（图片优先，自动压暗保证文字可读）
// 后端接入：PATCH /users/me/avatar（见 docs/待补后端接口.md #13）+ /users/me/profile
const { AVATARS } = require("./media.js");

const ME = {
  name: "林青云",
  ch: "林",
  avatarUrl: AVATARS.lin, // ← 头像接口；本地演示人像，接口就绪后替换
  bio: "把每一天的坚持都留下来。",
  bg: "#175A67",          // ← 主页背景色（六色预设）
  bgUrl: "",              // 主页背景保留品牌色与飞鹤，不铺照片
  fg: "#FFFFFF"
};
const BG_PRESETS = ["#175A67", "#0F454F", "#12333B", "#B26A00", "#3641C4", "#E8960C", "#5C6B64"];
module.exports = { ME, BG_PRESETS };
