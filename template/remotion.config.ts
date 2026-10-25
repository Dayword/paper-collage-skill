/**
 * Remotion CLI 配置。
 * 注意：用 Node API（scripts/stills.mjs）渲染时这里不生效，参数要直接传给 API。
 */
import { Config } from "@remotion/cli/config";

Config.setVideoImageFormat("jpeg");
Config.setOverwriteOutput(true);
