// 生成 styles/circle-marks.wxss：从可读 SVG 源码产出小程序可用的 data-URI。
// 手写 8 条编码串必然出错，形状改动只改这里再跑一遍：node tools/gen-circle-marks.js
const fs = require("fs");
const path = require("path");

// 统一规格：24×24 画布、1.6 描边、圆头圆角、只描边不填充。形状差异承担识别，不靠配色。
const STROKE = "#0F4F53";
const MARKS = {
  // 算法：二叉树（根 + 左右子）
  algo: `<circle cx="12" cy="4.6" r="2.2"/><circle cx="6" cy="19.4" r="2.2"/><circle cx="18" cy="19.4" r="2.2"/><path d="M12 6.8v4.4M12 11.2H6v6M12 11.2h6v6"/>`,
  // 考研：学位帽
  kaoyan: `<path d="M12 4 2.6 8.6 12 13.2 21.4 8.6Z"/><path d="M6.6 10.7v4.5c0 1.6 2.4 2.9 5.4 2.9s5.4-1.3 5.4-2.9v-4.5"/><path d="M21.4 8.6v5.2"/>`,
  // 论文：带折角的文稿 + 两行正文
  lunwen: `<path d="M14 3H7.2A1.7 1.7 0 0 0 5.5 4.7v14.6A1.7 1.7 0 0 0 7.2 21h9.6a1.7 1.7 0 0 0 1.7-1.7V7.5Z"/><path d="M14 3v4.5h4.5"/><path d="M8.7 12.6h6.6M8.7 16.1h4.4"/>`,
  // 跳蚤市场：价签
  market: `<path d="M20.3 12.7 12.7 20.3a1.8 1.8 0 0 1-2.6 0L3.7 13.9a1.8 1.8 0 0 1-.5-1.3V4.7A1.7 1.7 0 0 1 4.9 3h7.9a1.8 1.8 0 0 1 1.3.5l6.2 6.2a1.8 1.8 0 0 1 0 3Z"/><circle cx="8.1" cy="8.1" r="1.5"/>`,
  // 机器学习：芯片（算力/模型）
  ml: `<rect x="7" y="7" width="10" height="10" rx="2.2"/><path d="M10.2 3.2v3.8M13.8 3.2v3.8M10.2 17v3.8M13.8 17v3.8M3.2 10.2h3.8M3.2 13.8h3.8M17 10.2h3.8M17 13.8h3.8"/>`,
  // 英语角：对话气泡
  english: `<path d="M4 6.6A2.6 2.6 0 0 1 6.6 4h10.8A2.6 2.6 0 0 1 20 6.6v6.8a2.6 2.6 0 0 1-2.6 2.6h-7.1L5.6 19.4V16h-.2A2.6 2.6 0 0 1 4 13.4Z"/><path d="M8.5 8.7h7M8.5 11.9h4.4"/>`,
  // 考公：公文包
  gwy: `<rect x="3" y="7.4" width="18" height="12.4" rx="2.2"/><path d="M8.6 7.4V5.6A1.6 1.6 0 0 1 10.2 4h3.6a1.6 1.6 0 0 1 1.6 1.6v1.8"/><path d="M3 12.6h18"/>`,
  // 摄影：相机
  photo: `<path d="M3 9.5A2.3 2.3 0 0 1 5.3 7.2h2.2l1.4-2.2h6.2l1.4 2.2h2.2A2.3 2.3 0 0 1 21 9.5v8a2.3 2.3 0 0 1-2.3 2.3H5.3A2.3 2.3 0 0 1 3 17.5Z"/><circle cx="12" cy="13.4" r="3.4"/>`
};

const enc = s => s
  .replace(/%/g, "%25")
  .replace(/"/g, "%22")
  .replace(/#/g, "%23")
  .replace(/</g, "%3C")
  .replace(/>/g, "%3E")
  .replace(/\s+/g, "%20");

const head = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="${STROKE}" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">`;

const lines = [
  "/* 圈子线性徽记（自动生成，勿手改）：node tools/gen-circle-marks.js",
  "   统一 24×24 画布 / 1.6 描边 / 圆头圆角 / 只描边不填充。",
  "   单字「算/考/论」只能读，图形才能扫——识别靠形状，不靠给每个圈子配一种撞色。 */",
  ".cm{width:44rpx;height:44rpx;background-repeat:no-repeat;background-position:center;background-size:contain}",
  ".cm-lg{width:56rpx;height:56rpx}"
];
for (const k of Object.keys(MARKS)) {
  lines.push(`.cm-${k}{background-image:url("data:image/svg+xml,${enc(head + MARKS[k] + "</svg>")}")}`);
}
lines.push("");

fs.writeFileSync(path.join(__dirname, "..", "styles", "circle-marks.wxss"), lines.join("\n"), "utf8");
console.log("wrote styles/circle-marks.wxss —", Object.keys(MARKS).length, "marks");
