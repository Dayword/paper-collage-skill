---
name: paper-collage-promo
description: 用「纸质拼贴 + 粗描边贴纸」的科普 MG 风格，把产品/App/SaaS/开源项目做成 45–60 秒横屏宣传片（米白纸底、撕纸边、半调网点、硬阴影贴纸、真机截图装进手机贴纸、按 120BPM 卡点）。用户说「做一支纸质拼贴/手账/剪贴画风的宣传片」「把产品做成贴纸风短片」「照着这个视频做一个」「做一个能办事的科普 MG」时使用。
---

# 纸质拼贴宣传片生成器

一支片子的全部零件都在 `template/` 里，**它是一个能直接渲染的完整 Remotion 工程**。
所以永远从「能跑的成片」开始改，而不是从零搭。

参考成片：`preview/demo-60s.mp4`（60 秒，真实产品案例）。模板自带 demo：`preview/template-demo.mp4`（16 秒，无音乐）。

## 产物

| 文件 | 说明 |
|---|---|
| `<项目> 1080p.mp4` | 成片，H.264 / 30fps / 1920×1080 / AAC 48k，−14 LUFS |
| `工程/` | 全部源码，可重渲 |
| `分镜样张.jpg` | 关键帧总览，用来核对分镜 |
| `需求确认.md` | 用户拍板的全部决定（时长/风格/素材/声音） |

## 工作流（顺序不要跳）

1. **需求问询**（一次问完，最多 5 个问题）：产品是什么、给谁看、要突出哪 3–5 个功能、
   画幅与时长（默认 60s·1080p）、声音方案（有音乐文件吗？要不要旁白）。
   **没确认前不要动工程。**
2. **调研**：读产品的 README/官网/代码，把每个卖点追到可核实的出处（文档、截图、真实数据）。
   拿不到第一手素材就先停下问用户，别用编的数字凑。
3. **搭工程**：复制 `template/` → `<输出目录>/工程/`，`npm i`，`npm run fonts`，先渲一次确认基线能跑。
4. **写分镜**：按 120BPM（一拍 0.5s、一小节 2s）排 30 小节，场景边界**只能落在 2.0s 的整数倍**上。
   结构见 `references/02-storyboard.md`。
5. **配乐与卡点**：`python scripts/music.py analyze <曲>` 拿到 beat/bar 与鼓点进入时间，
   反推 `drop` 与 `musicOffset` 写进 `src/timing.json`。没有音乐就用静音占位，别自己编曲。
6. **做画面**：一个场景一个组件，接收绝对时间 `t`，时间窗外返回 `null`。
   组件手册见 `references/03-components.md`；截图怎么取见 `references/04-shots.md`。
7. **先静帧后全片**：`node scripts/stills.mjs 3.2 9.5 18.8` 逐段核对构图（几十秒一次），
   改到没有遮挡/裁切/空洞，再 `npx remotion render`。
8. **混音与交付**：`python scripts/mix.py`（−14 LUFS / −1 dBTP）→ 渲染 → `python scripts/check_video.py`
   （规格/响度/抽帧联系表）→ 打开联系表看一遍 → 拷到项目目录。

## 四条铁律

- **真实截图是主角，代码绘制只做包装。** 每个功能段落至少 1 张真机截图，全片不少于 8 张。
  截图必须是这个产品真做出来的，不能拿别家的演示图冒充。
- **一切卡在拍点上。** 场景边界、贴纸弹入、数字落定，都落在 0.5s 的整数倍；
  开场 6 秒内必须进鼓，片尾落在重拍上。
- **先静帧后全片。** 静帧几十秒，全片几分钟到十几分钟；错误在静帧阶段修完。
- **一套组件，处处复用。** 纸底、撕边、贴纸、手机框、印章只在 `components/` 里有一份，
  不在场景里手写第二版——否则质感立刻不统一。

## 快速开始

```bash
git clone <this-repo> paper-collage-promo && cd paper-collage-promo/template
npm i
python3 scripts/fonts.py          # Windows 用 python scripts/fonts.py
npx remotion studio               # 打开预览，改文案即时看到
npx remotion render Promo out/demo.mp4
```

换文案只需要动 `src/scenes/Demo.tsx`；改时间只动 `src/timing.json`；换图只覆盖 `public/img/`。

## 目录

```
paper-collage-promo/
├── SKILL.md                  ← 你正在读
├── README.md                 ← 给人看的介绍
├── preview/                  ← 成片、动图、分镜图、风格样帧
├── references/
│   ├── 01-style.md           配色/字体/纸张/贴纸/动效的具体参数
│   ├── 02-storyboard.md      60s = 30 小节的叙事结构模板
│   ├── 03-components.md      Paper / Phone / Bits / anim 的 API
│   ├── 04-shots.md           4K 截图、挑图、焦点裁切、音乐分析
│   └── 05-pitfalls.md        踩过的坑，改版前先读
└── template/                 ← 可跑的 Remotion 工程
    ├── src/
    │   ├── timing.json       唯一时间源
    │   ├── Promo.tsx         主合成：按顺序叠场景
    │   ├── scenes/Demo.tsx   三段示例（开场/功能/片尾）
    │   ├── components/       Paper · Phone · Bits
    │   └── lib/              anim（缓动工具）· theme（配色字体）
    ├── public/               img / audio / fonts
    └── scripts/              fonts · music · mix · stills · check_video · shot
```

## 换皮清单（克隆后按顺序改）

- [ ] `src/lib/theme.ts` — 配色。改 `yellow/orange/red` 三个强调色就够，纸白与墨黑别动。
- [ ] `fonts.json` + `npm run fonts` — 换字族要同步改 `src/lib/fonts.ts` 的加载路径。
- [ ] `src/timing.json` — `duration`、`scenes`、`drop`、`musicOffset`。
- [ ] `src/scenes/` — 文案与版式；`src/Promo.tsx` — 场景顺序。
- [ ] `public/img/` — 真机截图（保持原比例）。
- [ ] `audio-src/music.mp3` + `python scripts/mix.py` — 配乐与音效。
- [ ] `preview/` — 换成你自己的成片与截图。

## 许可

MIT。参考成片里的产品截图归原产品所有，仅作风格示例，不要直接拿去商用。
