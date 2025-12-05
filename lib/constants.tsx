"use client";

import {
  Square,
  Activity,
  RefreshCcw,
  Move,
  Waves,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { AnimationType } from "@/types";

export const PRESET_STYLES = [
  {
    id: "realistic",
    label: "写实摄影",
    value:
      "photorealistic, 8k, highly detailed, cinematic lighting, realistic textures",
  },
  {
    id: "anime",
    label: "日系动漫",
    value:
      "anime style, studio ghibli, vibrant colors, cel shading, detailed background",
  },
  {
    id: "watercolor",
    label: "清新水彩",
    value:
      "watercolor painting, soft edges, artistic, pastel colors, dreamy atmosphere",
  },
  {
    id: "cyberpunk",
    label: "赛博朋克",
    value: "cyberpunk, neon lights, futuristic city, high contrast, tech noir",
  },
  {
    id: "3d",
    label: "3D 渲染",
    value:
      "3D render, blender, unreal engine 5, c4d, clay material, soft lighting",
  },
  {
    id: "illustration",
    label: "扁平插画",
    value: "flat illustration, vector art, minimal, clean lines, bold colors",
  },
  {
    id: "oil",
    label: "油画风格",
    value:
      "oil painting, textured brushstrokes, classical art style, van gogh style",
  },
  {
    id: "pixel",
    label: "像素艺术",
    value: "pixel art, 8-bit, retro game style, blocky",
  },
  {
    id: "chinese",
    label: "中国风",
    value:
      "chinese traditional painting, ink wash painting, shan shui style, elegant, artistic, flowing lines",
  },
  {
    id: "cartoon",
    label: "卡通风格",
    value:
      "cartoon style, vivid colors, expressive characters, smooth lines",
  },
  {
    id: "sketch",
    label: "素描手绘",
    value: "pencil sketch, graphite, rough lines, artistic, black and white",
  },
  {
    id: "impressionism",
    label: "印象派",
    value:
      "impressionism, claude monet style, light and color, visible brushstrokes",
  },
  {
    id: "surrealism",
    label: "超现实",
    value: "surrealism, dreamlike, salvador dali style, bizarre, imaginative",
  },
  {
    id: "popart",
    label: "波普艺术",
    value:
      "pop art, andy warhol style, vibrant colors, comic book style, bold outlines",
  },
  {
    id: "ukiyoe",
    label: "浮世绘",
    value:
      "ukiyo-e, japanese woodblock print, hokusai style, flat perspective",
  },
  {
    id: "gothic",
    label: "哥特风",
    value: "gothic, dark, mysterious, detailed architecture, gloomy atmosphere",
  },
  {
    id: "steampunk",
    label: "蒸汽朋克",
    value: "steampunk, gears, brass, victorian era, mechanical details",
  },
];

export const MOOD_PACKS = [
  { id: "custom", label: "自定义", items: [] },
  {
    id: "worker",
    label: "打工人",
    items: [
      { text: "收到", prompt: "敬礼，眼神坚定，戴着领带，职业感" },
      { text: "下班", prompt: "飞快地逃跑，开心，模糊的背景" },
      { text: "太难了", prompt: "躺在地上，精疲力尽，流着夸张的眼泪" },
      { text: "摸鱼", prompt: "喝着咖啡，戴着墨镜，悠闲放松" },
    ],
  },
  {
    id: "daily",
    label: "日常",
    items: [
      { text: "早上好", prompt: "挥手，开心大笑，阳光背景" },
      { text: "晚安", prompt: "睡觉，戴着睡帽，安详" },
      { text: "谢谢", prompt: "鞠躬，双手比心，感激" },
      { text: "？", prompt: "困惑的表情，满头问号" },
    ],
  },
  {
    id: "happy",
    label: "开心",
    items: [
      { text: "哈哈哈", prompt: "开怀大笑，眼睛眯成一条线，手舞足蹈" },
      { text: "太棒了", prompt: "高举双手，兴奋跳跃，背景有彩带" },
      { text: "好开心", prompt: "灿烂的笑容，比出胜利手势，阳光明媚" },
      { text: "耶", prompt: "双手比V，开心大叫，充满活力" },
    ],
  },
  {
    id: "angry",
    label: "生气",
    items: [
      { text: "气死我了", prompt: "眉头紧皱，双手叉腰，愤怒的表情" },
      { text: "哼", prompt: "扭头，撅嘴，不屑的表情" },
      { text: "太过分了", prompt: "瞪大眼睛，手指前方，愤怒" },
      { text: "无语", prompt: "翻白眼，摊手，无奈的表情" },
    ],
  },
  {
    id: "sad",
    label: "悲伤",
    items: [
      { text: "哭了", prompt: "流着眼泪，低头，悲伤的表情" },
      { text: "好难过", prompt: "双手抱膝，低头，阴郁的氛围" },
      { text: "委屈", prompt: "眼泪汪汪，撅嘴，可怜的表情" },
      { text: "心碎", prompt: "手捂胸口，痛苦的表情，背景暗淡" },
    ],
  },
  {
    id: "surprised",
    label: "惊讶",
    items: [
      { text: "什么？", prompt: "瞪大眼睛，嘴巴张大，震惊的表情" },
      { text: "真的吗", prompt: "双手捂嘴，眼睛瞪大，不敢相信" },
      { text: "哇", prompt: "张大嘴巴，眼睛发亮，惊喜的表情" },
      { text: "不会吧", prompt: "摇头，瞪大眼睛，难以置信" },
    ],
  },
  {
    id: "funny",
    label: "搞笑",
    items: [
      { text: "哈哈哈", prompt: "夸张的大笑，前仰后合，滑稽" },
      { text: "笑死我了", prompt: "捂着肚子笑，眼泪都笑出来了" },
      { text: "太搞笑了", prompt: "做鬼脸，滑稽的表情，逗趣" },
      { text: "哈哈哈", prompt: "笑得停不下来，手舞足蹈" },
    ],
  },
  {
    id: "love",
    label: "恋爱",
    items: [
      { text: "爱你", prompt: "双手比心，眼神温柔，甜蜜的笑容" },
      { text: "么么哒", prompt: "飞吻，眨眼，可爱的表情" },
      { text: "想你", prompt: "手捧脸颊，眼神温柔，浪漫的氛围" },
      { text: "害羞", prompt: "脸红，低头，双手捂脸，可爱" },
    ],
  },
  {
    id: "study",
    label: "学习",
    items: [
      { text: "加油", prompt: "握拳，眼神坚定，充满斗志" },
      { text: "学习", prompt: "戴着眼镜，认真看书，专注的表情" },
      { text: "考试", prompt: "紧张，额头冒汗，焦虑的表情" },
      { text: "好难", prompt: "抓头发，困惑，头疼的表情" },
    ],
  },
  {
    id: "food",
    label: "美食",
    items: [
      { text: "好吃", prompt: "享受美食，满足的表情，眼睛发亮" },
      { text: "饿了", prompt: "摸着肚子，可怜巴巴，期待的眼神" },
      { text: "想吃", prompt: "流口水，眼睛盯着食物，渴望" },
      { text: "好香", prompt: "闻香味，陶醉的表情，享受" },
    ],
  },
  {
    id: "sleep",
    label: "睡觉",
    items: [
      { text: "好困", prompt: "打哈欠，眼睛半闭，疲惫" },
      { text: "睡觉", prompt: "戴着睡帽，闭眼，安详" },
      { text: "晚安", prompt: "挥手，温柔的笑容，准备睡觉" },
      { text: "起床", prompt: "揉眼睛，伸懒腰，刚睡醒" },
    ],
  },
  {
    id: "celebration",
    label: "庆祝",
    items: [
      { text: "恭喜", prompt: "鼓掌，开心的笑容，庆祝的氛围" },
      { text: "生日快乐", prompt: "吹蜡烛，开心的笑容，派对氛围" },
      { text: "干杯", prompt: "举杯，开心的笑容，庆祝" },
      { text: "成功", prompt: "高举双手，胜利的表情，兴奋" },
    ],
  },
];

export const ANIMATION_OPTIONS = [
  { id: AnimationType.NONE, label: "静态", icon: <Square size={14} /> },
  { id: AnimationType.SHAKE, label: "颤抖", icon: <Activity size={14} /> },
  {
    id: AnimationType.PULSE,
    label: "脉冲",
    icon: <div className="w-3 h-3 rounded-full border-2 border-current"></div>,
  },
  {
    id: AnimationType.ZOOM,
    label: "放大",
    icon: <div className="text-xs">🔍</div>,
  },
  { id: AnimationType.ROTATE, label: "旋转", icon: <RefreshCcw size={14} /> },
  { id: AnimationType.BOUNCE, label: "弹跳", icon: <Move size={14} /> },
  { id: AnimationType.WIGGLE, label: "摇摆", icon: <Waves size={14} /> },
  { id: AnimationType.FADE, label: "淡入淡出", icon: <Sparkles size={14} /> },
  { id: AnimationType.SWING, label: "摆动", icon: <TrendingUp size={14} /> },
];

export const STORAGE_KEY = "ip_creative_history_v1";
export const USER_TIER_KEY = "ip_creative_user_tier";
export const DAILY_USAGE_KEY = "ip_creative_daily_usage";
export const MAX_HISTORY_ITEMS = 10;
export const FREE_DAILY_LIMIT = 3;
export const PREMIUM_DAILY_LIMIT = 50;
