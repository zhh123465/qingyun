// 演示内容图片（Unsplash / Pexels 免费图库，下载后本地化，避免小程序域名校验与防盗链）
// 源图：https://unsplash.com / https://www.pexels.com；Unsplash License / Pexels 免费许可，可商用免署名。
// 正式内容接入后由接口返回 URL，本文件只作为原型期的兜底映射。
//
// 封面来源（文件名 → 图库 ID）：
//   sunset.jpg        Pexels 2983489        黄昏粉紫天空（竖幅 3:4，给详情页头图与缩略图）
//   sunset-wide.jpg   同上，底部锚定裁成 16:9（给发现页跨列精选位；竖幅直接 aspectFill 会只剩天空）
//   library.jpg       Unsplash 1568667256549 图书馆书架
//   study-desk.jpg    Unsplash 1524995997946 书桌
//   ginkgo.jpg        Pexels 19570360       银杏
//   code.jpg          Unsplash 1461749280684 代码屏
//   campus.jpg        Unsplash 1541339907198 毕业抛帽
//   group-study.jpg   Unsplash 1522202176988 学习小组
//   running.jpg       Unsplash 1552674605    夜跑
//   books.jpg         Unsplash 1497633762265 教材
//   group-laptops.jpg Unsplash 1519389950473 协作
//   study-books.jpg   Unsplash 1456513080510 翻开的书
//
// 头像来源（Pexels，均已按人脸位置裁成 256×256 方图，避免圆形裁切切掉额头）：
//   lin 5537546 / chen 7705911 / zhou 5538007 / wang 32222848
//   su 8554830 / zheng 8199560 / li 8368625
const COVERS = {
  sunset: "/assets/images/covers/sunset.jpg",
  sunsetWide: "/assets/images/covers/sunset-wide.jpg",
  library: "/assets/images/covers/library.jpg",
  studyDesk: "/assets/images/covers/study-desk.jpg",
  ginkgo: "/assets/images/covers/ginkgo.jpg",
  code: "/assets/images/covers/code.jpg",
  campus: "/assets/images/covers/campus.jpg",
  groupStudy: "/assets/images/covers/group-study.jpg",
  running: "/assets/images/covers/running.jpg",
  books: "/assets/images/covers/books.jpg",
  groupLaptops: "/assets/images/covers/group-laptops.jpg",
  studyBooks: "/assets/images/covers/study-books.jpg"
};

const AVATARS = {
  lin: "/assets/images/avatars/lin.jpg",
  chen: "/assets/images/avatars/chen.jpg",
  zhou: "/assets/images/avatars/zhou.jpg",
  wang: "/assets/images/avatars/wang.jpg",
  su: "/assets/images/avatars/su.jpg",
  zheng: "/assets/images/avatars/zheng.jpg",
  li: "/assets/images/avatars/li.jpg"
};

const AVATAR_BY_NAME = {
  "林青云": AVATARS.lin,
  "陈思远": AVATARS.chen,
  "周晓": AVATARS.zhou,
  "王立": AVATARS.wang,
  "苏墨": AVATARS.su,
  "郑雨桐": AVATARS.zheng,
  "李想": AVATARS.li
};

// 圈子动态按内容类型匹配配图；资料（doc）故意不给图——文件就用文件徽标，拿照片冒充文件是假的
const CD_PHOTO = {
  code: COVERS.code,
  qa: COVERS.groupStudy,
  chk: COVERS.running,
  tag: COVERS.books
};

function avatarOf(name) { return AVATAR_BY_NAME[name] || ""; }

module.exports = { COVERS, AVATARS, AVATAR_BY_NAME, CD_PHOTO, avatarOf };
