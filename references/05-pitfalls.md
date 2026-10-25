# 05 · 踩坑记录

按「症状 → 原因 → 修法」记。改版前先扫一遍，能省半天。

## 版式

**标题第二行掉下来 / 字幕被挤成两行**
中文比英文宽，`fontSize` 稍微一大就换行。
→ 标题一律加 `whiteSpace: "nowrap"`，宁可减字号。减到 92 还不行就砍字，不要缩行距。

**两张白贴纸叠在一起**
同一位置连续弹两张白底贴纸，第二张会把第一张糊成一块白斑。
→ 一屏同类贴纸不超过 2 张，且必须有颜色区分（白 / 黄 / 深色）。

**贴纸压住手机**
`right` 定位的贴纸在 1920 宽下会越界到手机上方。
→ 贴纸统一走「左栏 `left`」或「右栏 `right`」，中间给手机留 500px 的净空。

**收据/卡片压住底部贴纸**
卡片是流式高度，内容一多就往下长。
→ 先定卡片 `top`，再算它的高度（`padding + 行高×行数`），底部元素 `top` 必须大于这个值。

**片尾撕纸边看着是直线**
`TornBand` 默认 `edge="top"`，上下都用同一条会有一侧是直的。
→ 上面那条用 `edge="bottom"`，下面那条用 `edge="top"`，高度 232–252 才像纸带。

**下半屏空了三分之一**
出处小字被 `bottom: 96` 钉在页面底部，内容又都挤在上半屏，中间就空出一条沟。
→ 要么把内容块整体下移，要么把小字提上来跟内容成组。**别靠加装饰填洞**。

**手绘箭头压在标题上**
箭头是绝对定位，标题一变长就被压。
→ 箭头只从「元素 A 的右下角」指向「元素 B 的左上角」，两头都要留 ≥40px 净空。

## 素材

**截图整屏发灰**
用了带蒙层/弹窗的截图（比如点了「我的会员码」后的暗底弹出层）。
→ 换一张背景明亮的截图，或把 `tint` 去掉。

**截图被横向压扁**
某些 CSS 框架的 preflight 会给 `img { max-width: 100% }`，放大后宽度被压回容器、高度不变。
→ `src/index.css` 里 `img, video { max-width: none }`，别删。

**一张张点素材会漏掉最好的图**
→ 先 `scripts/sheet.py` 拼联系表，再挑。

## 声音

**渲染出来的成片结尾有一声「咔」**
线性淡出到最后一帧还有 −20 dB 残余。
→ `audiolib.place(..., fade_out_exp=2.4)`，指数淡出，末 30ms 降到 −40 dB 以下。

**重新编码后真峰值超过 0 dBFS**
AAC 有损编码会产生采样间过冲：−1.0 dBTP 的母带，192k 编码后冲到 −0.4、256k 冲到 −0.2。
→ **固定用 320k**（实测回到 −1.0 dBTP）。只改音频时用 `-c:v copy` 换轨，别重渲整片。

**音效和画面对不上**
`mix.py` 里的音效表没跟着 `timing.json` 改。
→ 音效一律写成 `at("scene", dt, ...)` 相对场景起点，不写绝对秒数。

## 环境

**Remotion 一直卡在下载 Chrome Headless Shell（9MB / 149MB）**
国内网络常见。
→ 用本机浏览器：
```bash
export REMOTION_BROWSER_EXECUTABLE="C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe"   # Windows
export REMOTION_BROWSER_EXECUTABLE="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"   # macOS
node scripts/stills.mjs 3.2 9.5
```
CLI 渲染时对应 `--browser-executable=... --chrome-mode=chrome-for-testing`。

**Windows Git Bash 里写 `/tmp` 的文件消失**
→ 临时文件一律放项目下的 `.tmp_work/`。

**`pip install -r requirements.txt` 卡十几分钟**
国内源对某些包会 403。
→ 逐个装：`numpy` → `Pillow fonttools` → `scipy brotli`。

**`tsc` 报 TS6133 'xxx' is declared but never read**
删了某个元素但顺手留了变量/导入。
→ Remotion 渲染前会跑类型检查，先 `npx tsc --noEmit` 过一遍再渲。

**`require()` 加载 public 里的图报错**
→ 浏览器端资源用 `<Img src={staticFile("img/x.png")} />`，不要 `require`。

**npm scripts 里写 `python3`，Windows 上没有**
→ Windows 直接 `python scripts/xxx.py`；`package.json` 里保留 `python3`，文档两行都写。

## 流水线

**一次静帧要 30 秒，一次全片要 4 分钟**
→ 改版时永远先 `node scripts/stills.mjs <秒数>`。全片只在静帧全过之后渲一次。

**只改了配乐却重渲整片**
→ `ffmpeg -i 成片.mp4 -i public/audio/mix.wav -map 0:v -map 1:a -c:v copy -c:a aac -b:a 320k -shortest out.mp4`
