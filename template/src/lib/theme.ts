export const C = {
  paper: "#F7EFDD",
  paperDeep: "#EFE3C9",
  ink: "#161616",
  inkSoft: "#4A4030",
  yellow: "#FFC53D",
  yellowSoft: "#FFE28A",
  orange: "#FF7A1A",
  red: "#E8412C",
  blue: "#2E6BE6",
  teal: "#17B0A0",
  white: "#FFFFFF",
};

export const FONT = {
  display: '"PF", "Microsoft YaHei", "Noto Sans SC", sans-serif',
  body: '"PF", "Microsoft YaHei", "Noto Sans SC", sans-serif',
  hand: '"HAND", "KaiTi", "Microsoft YaHei", serif',
};

/** Hard offset shadow used by every sticker / paper card. */
export const shadow = (size = 12, color = C.ink) => `${size}px ${size}px 0 ${color}`;
