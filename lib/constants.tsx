'use client';

import { Square, Activity, RefreshCcw } from 'lucide-react';
import { AnimationType } from '@/types';

export const PRESET_STYLES = [
  {
    id: 'realistic',
    label: '写实摄影',
    value:
      'photorealistic, 8k, highly detailed, cinematic lighting, realistic textures',
  },
  {
    id: 'anime',
    label: '日系动漫',
    value:
      'anime style, studio ghibli, vibrant colors, cel shading, detailed background',
  },
  {
    id: 'watercolor',
    label: '清新水彩',
    value: 'watercolor painting, soft edges, artistic, pastel colors, dreamy atmosphere',
  },
  {
    id: 'cyberpunk',
    label: '赛博朋克',
    value: 'cyberpunk, neon lights, futuristic city, high contrast, tech noir',
  },
  {
    id: '3d',
    label: '3D 渲染',
    value:
      '3D render, blender, unreal engine 5, c4d, clay material, soft lighting',
  },
  {
    id: 'illustration',
    label: '扁平插画',
    value: 'flat illustration, vector art, minimal, clean lines, bold colors',
  },
  {
    id: 'oil',
    label: '油画风格',
    value:
      'oil painting, textured brushstrokes, classical art style, van gogh style',
  },
  {
    id: 'pixel',
    label: '像素艺术',
    value: 'pixel art, 8-bit, retro game style, blocky',
  },
];

export const MOOD_PACKS = [
  { id: 'custom', label: '自定义', items: [] },
  {
    id: 'worker',
    label: '打工人',
    items: [
      { text: '收到', prompt: '敬礼，眼神坚定，戴着领带，职业感' },
      { text: '下班', prompt: '飞快地逃跑，开心，模糊的背景' },
      { text: '太难了', prompt: '躺在地上，精疲力尽，流着夸张的眼泪' },
      { text: '摸鱼', prompt: '喝着咖啡，戴着墨镜，悠闲放松' },
    ],
  },
  {
    id: 'daily',
    label: '日常',
    items: [
      { text: '早上好', prompt: '挥手，开心大笑，阳光背景' },
      { text: '晚安', prompt: '睡觉，戴着睡帽，安详' },
      { text: '谢谢', prompt: '鞠躬，双手比心，感激' },
      { text: '？', prompt: '困惑的表情，满头问号' },
    ],
  },
];

export const ANIMATION_OPTIONS = [
  { id: AnimationType.NONE, label: '静态', icon: <Square size={14} /> },
  { id: AnimationType.SHAKE, label: '颤抖', icon: <Activity size={14} /> },
  {
    id: AnimationType.PULSE,
    label: '脉冲',
    icon: <div className="w-3 h-3 rounded-full border-2 border-current"></div>,
  },
  {
    id: AnimationType.ZOOM,
    label: '放大',
    icon: <div className="text-xs">🔍</div>,
  },
  { id: AnimationType.SPIN, label: '旋转', icon: <RefreshCcw size={14} /> },
];

export const STORAGE_KEY = 'ip_creative_history_v1';
export const USER_TIER_KEY = 'ip_creative_user_tier';
export const DAILY_USAGE_KEY = 'ip_creative_daily_usage';
export const MAX_HISTORY_ITEMS = 10;
export const FREE_DAILY_LIMIT = 5;
export const PREMIUM_DAILY_LIMIT = 50;

