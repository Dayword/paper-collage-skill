# 03 · 组件手册

所有组件都在 `src/components/`，动画工具在 `src/lib/anim.ts`。**不要复制一份改**，
要变就加参数——同一套参数全片共用，质感才统一。

## 场景的基本形状

```tsx
import { EASE, ramp, scene } from "../lib/anim";

export const MyScene: React.FC<{ t: number }> = ({ t }) => {
  const s = scene("myscene");              // 从 timing.json 读 [start, end]
  if (t < s.start || t >= s.end) return null;   // 时间窗外什么都不画

  const p = ramp(t, [s.start + 0.2, s.start + 0.46], [0, 1], EASE.back);
  return (
    <AbsoluteFill style={{ opacity: 1 - ramp(t, [s.end - 0.3, s.end]) }}>
      <PaperBg dots="tr" />
      {/* ... */}
    </AbsoluteFill>
  );
};
```

`t` 是**绝对秒数**（主合成统一算好传进来），不是场景内相对时间。所有时间点写成 `s.start + x`。

## Paper.tsx

```tsx
<PaperBg tone?={string} dots?={"tl"|"tr"|"bl"|"br"|"none"} dotColor?={string} vignette?={boolean} />

torn(edge: "top"|"bottom", seed: number): string      // 返回 clip-path polygon
<TornBand top?={number} bottom?={number} height={number} color?={string}
          seed?={number} rotate?={number} edge?={"top"|"bottom"} />
```

- `PaperBg` 是最底层，每个场景第一个渲染。`dots` 选一个角，别贪。
- `torn` 是确定性伪随机：同 seed 每帧一致。想换撕裂形状就换 seed（1–6 够用）。
- `TornBand` 只有 `edge` 那一侧是撕的，另一侧是直边——所以要让直边伸出画面（`top={-40}`）。

## Phone.tsx

```tsx
<Phone src="img/phone/home.png" left={1120} top={58} width={430} rotate={2.4}
       zoom={1.6} fx={0.5} fy={0.3} e={0.8} />

<Phone left={1120} top={58} width={430}>
  <MyFakeUI />          {/* 不传 src 时，children 直接铺满屏幕区 */}
</Phone>
```

| 参数 | 说明 |
|---|---|
| `width` | 高度自动按 1346/585 算。**1080 高的画面里 width 最大 430–440**，再大会出画 |
| `zoom` | 1 = 全图；1.4–2.2 用来推近到对话气泡/按钮 |
| `fx/fy` | 焦点，0..1。推近时把它对准要强调的元素 |
| `e` | 入场进度，内部自动做 `translateY(54→0)` + `scale(.94→1)` |
| `rotate` | ±3°，多张并排时一正一负 |

⚠️ 截图必须保持原比例。`index.css` 里的 `img { max-width: none }` 就是防这个，别删。

## Bits.tsx

```tsx
<Sticker color?={string} text?={string} fontSize?={number} rotate?={number}
         e?={number} border?={number} shadowSize?={number}
         padding?={string} radius?={number}>文案</Sticker>

<Hl color?={string}>要比划的那几个字</Hl>

<HandArrow width?={number} flip?={boolean} color?={string} dash?={boolean} />

<Duck size?={number} wink?={boolean} />          {/* 示例角色，换成你自己的 SVG */}

<Stamp rotate?={number} e?={number} color?={string} fontSize?={number}>已到账</Stamp>

<Counter t={t} from={0} to={320} start={12.75} dur={0.9} suffix=" 币" />
```

- `Sticker` 的 `e` 既控制透明度也控制 `scale(0.7→1)`，所以入场只要传 `ramp(...)` 的结果。
- `Hl` 的黄块会左右各溢出一点点并轻微倾斜，这是「马克笔」的关键，不要改成规整矩形。
- `Stamp` 用 `mixBlendMode: multiply`，压在纸上才有油墨感。`scale(1.35 - 0.35*e)` 是落定动画。
- `Counter` 需要 `t`，内部用 `tabular-nums` 保证数字不左右跳。

## lib/anim.ts

```ts
scene(name)                        // → { start, end, dur }
ramp(t, [a, b], [0, 1], EASE.back) // 区间插值，两端 clamp
keys(t, [t1,t2,t3], [v1,v2,v3])    // 多段关键帧
inOut(t, a, b, c, d)               // 0→1 进，保持，1→0 出
impulse(t, at, decay=6)            // 衰减脉冲，用于闪白/冲击
shake(t, [at1, at2], amp=8, decay=9) // → {x, y}，确定性抖动
typed(text, t, start, end)         // 打字机
beatAt(start, i, div=1)            // 第 i 个拍点（div=2 就是半拍）
EASE = { out, back, inOut, in, soft, linear }
```

## timing.json

```json
{
  "fps": 30, "width": 1920, "height": 1080, "duration": 60,
  "beat": 0.5, "bar": 2, "drop": 6, "musicOffset": 1.08,
  "scenes": { "hook": [0, 6], "brand": [6, 8] },
  "pace": { "pop": 0.26, "step": 0.5, "hold": 0.8 }
}
```

改 `scenes` 就是改剪辑；`scripts/mix.py` 直接读这份表来定位音效，
所以**时间只在这里改一次**，画面和声音不会不同步。

## 加一个场景（三处都要动）

1. `src/timing.json` 的 `scenes` 加一行 `"myscene": [a, b]`（a、b 必须是 2.0 的整数倍）。
2. `src/scenes/` 写组件，`src/Promo.tsx` 里插到对应位置。
3. `scripts/mix.py` 的音效表里加 `"myscene": [a, b]`，否则音效会按旧时间轴落。

## 音效（可选）

`scripts/mix.py` 里用 `at(scene, dt, clip, gain)` 定位，`dt` 是**相对该场景起点**的秒数。
`audiolib.py` 自带：`sub_boom`（重低音冲击）、`blip`（贴纸弹入）、`flick`（纸片摩擦）、
`room_tone`（底噪）、`reverb`、`build_in`（渐强）。

```bash
python3 scripts/mix.py      # 输出 public/audio/mix.wav，自动归一化到 -14 LUFS / -1 dBTP
```
