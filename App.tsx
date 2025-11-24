import React, { useState, useRef, useEffect } from 'react';
import { AppView, LoadingState, GeneratedImage, UserTier, DailyUsage, MemeDraft, AnimationType } from './types';
import { generateExtendedScene, generateSticker } from './services/geminiService';
import TabBar from './components/TabBar';
import Loader from './components/Loader';
import JSZip from 'jszip';
import { 
  Image as ImageIcon, 
  UploadCloud, 
  ArrowRight, 
  Sparkles, 
  ChevronLeft,
  ChevronRight, 
  Download, 
  RefreshCcw,
  Wand2,
  Palette,
  Check,
  Trash2,
  X,
  Clock,
  Crown,
  Zap,
  LogOut,
  Smile,
  Layers,
  Share,
  Package,
  CheckSquare,
  Square,
  Play,
  Activity,
  Loader2
} from 'lucide-react';

// Declare gifshot globally
declare const gifshot: any;

// Define preset styles
const PRESET_STYLES = [
  { id: 'realistic', label: '写实摄影', value: 'photorealistic, 8k, highly detailed, cinematic lighting, realistic textures' },
  { id: 'anime', label: '日系动漫', value: 'anime style, studio ghibli, vibrant colors, cel shading, detailed background' },
  { id: 'watercolor', label: '清新水彩', value: 'watercolor painting, soft edges, artistic, pastel colors, dreamy atmosphere' },
  { id: 'cyberpunk', label: '赛博朋克', value: 'cyberpunk, neon lights, futuristic city, high contrast, tech noir' },
  { id: '3d', label: '3D 渲染', value: '3D render, blender, unreal engine 5, c4d, clay material, soft lighting' },
  { id: 'illustration', label: '扁平插画', value: 'flat illustration, vector art, minimal, clean lines, bold colors' },
  { id: 'oil', label: '油画风格', value: 'oil painting, textured brushstrokes, classical art style, van gogh style' },
  { id: 'pixel', label: '像素艺术', value: 'pixel art, 8-bit, retro game style, blocky' },
];

// Meme Mood Packs
const MOOD_PACKS = [
  { id: 'custom', label: '自定义', items: [] },
  { id: 'worker', label: '打工人', items: [
    { text: '收到', prompt: '敬礼，眼神坚定，戴着领带，职业感' },
    { text: '下班', prompt: '飞快地逃跑，开心，模糊的背景' },
    { text: '太难了', prompt: '躺在地上，精疲力尽，流着夸张的眼泪' },
    { text: '摸鱼', prompt: '喝着咖啡，戴着墨镜，悠闲放松' }
  ]},
  { id: 'daily', label: '日常', items: [
    { text: '早上好', prompt: '挥手，开心大笑，阳光背景' },
    { text: '晚安', prompt: '睡觉，戴着睡帽，安详' },
    { text: '谢谢', prompt: '鞠躬，双手比心，感激' },
    { text: '？', prompt: '困惑的表情，满头问号' }
  ]},
];

// Animation Presets
const ANIMATION_OPTIONS = [
  { id: AnimationType.NONE, label: '静态', icon: <Square size={14} /> },
  { id: AnimationType.SHAKE, label: '颤抖', icon: <Activity size={14} /> },
  { id: AnimationType.PULSE, label: '脉冲', icon: <div className="w-3 h-3 rounded-full border-2 border-current"></div> },
  { id: AnimationType.ZOOM, label: '放大', icon: <div className="text-xs">🔍</div> },
  { id: AnimationType.SPIN, label: '旋转', icon: <RefreshCcw size={14} /> },
];

const STORAGE_KEY = 'ip_creative_history_v1';
const USER_TIER_KEY = 'ip_creative_user_tier';
const DAILY_USAGE_KEY = 'ip_creative_daily_usage';
const MAX_HISTORY_ITEMS = 10;

// Quota Constants
const FREE_DAILY_LIMIT = 5;
const PREMIUM_DAILY_LIMIT = 50;

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>(AppView.HOME);
  const [sourceImage, setSourceImage] = useState<string | null>(null);
  const [mimeType, setMimeType] = useState<string>('image/png');
  const [prompt, setPrompt] = useState<string>('');
  const [selectedStyles, setSelectedStyles] = useState<string[]>([]);
  const [aspectRatio, setAspectRatio] = useState<string>('16:9');
  const [imageSize, setImageSize] = useState<"1K" | "2K" | "4K">("1K");
  const [imageFormat, setImageFormat] = useState<"PNG" | "JPEG" | "WEBP">("PNG");
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [loadingState, setLoadingState] = useState<LoadingState>(LoadingState.IDLE);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  
  // User & Quota State
  const [userTier, setUserTier] = useState<UserTier>(() => {
    return (localStorage.getItem(USER_TIER_KEY) as UserTier) || UserTier.FREE;
  });
  
  const [dailyUsage, setDailyUsage] = useState<DailyUsage>(() => {
    const saved = localStorage.getItem(DAILY_USAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
    return { date: new Date().toLocaleDateString(), count: 0 };
  });

  // History State
  const [history, setHistory] = useState<GeneratedImage[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error("Failed to load history", e);
      return [];
    }
  });
  const [viewingHistoryItem, setViewingHistoryItem] = useState<GeneratedImage | null>(null);
  
  // History Selection Mode (Batch Meme)
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedHistoryIds, setSelectedHistoryIds] = useState<string[]>([]);

  // Meme Editor State
  const [memeDrafts, setMemeDrafts] = useState<MemeDraft[]>([]);
  const [activeDraftIndex, setActiveDraftIndex] = useState(0);
  const [selectedMoodPack, setSelectedMoodPack] = useState<string>('custom');
  const [isExporting, setIsExporting] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // --- Effects for Persistence ---

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    localStorage.setItem(USER_TIER_KEY, userTier);
  }, [userTier]);

  useEffect(() => {
    localStorage.setItem(DAILY_USAGE_KEY, JSON.stringify(dailyUsage));
  }, [dailyUsage]);

  // Check and reset daily usage if date changed
  useEffect(() => {
    const today = new Date().toLocaleDateString();
    if (dailyUsage.date !== today) {
      setDailyUsage({ date: today, count: 0 });
    }
  }, []); // Run once on mount

  // --- Quota Helpers ---

  const getLimit = () => userTier === UserTier.PREMIUM ? PREMIUM_DAILY_LIMIT : FREE_DAILY_LIMIT;
  
  const isQuotaReached = (amount = 1) => {
    const today = new Date().toLocaleDateString();
    if (dailyUsage.date !== today) return false; 
    return (dailyUsage.count + amount) > getLimit();
  };

  const remainingQuota = () => {
    const today = new Date().toLocaleDateString();
    if (dailyUsage.date !== today) return getLimit();
    return Math.max(0, getLimit() - dailyUsage.count);
  };

  const updateUsage = (amount = 1) => {
    setDailyUsage(prev => {
      const today = new Date().toLocaleDateString();
      if (prev.date !== today) {
        return { date: today, count: amount };
      }
      return { ...prev, count: prev.count + amount };
    });
  };

  // --- Handlers ---

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSourceImage(reader.result as string);
        setMimeType(file.type);
        setErrorMsg(null);
        
        // Check if we came from the "Meme Maker" card on Home
        if (currentView === AppView.HOME) {
          // Initialize meme draft immediately
          setMemeDrafts([{
            id: Date.now().toString(),
            sourceUrl: reader.result as string,
            generatedUrl: null,
            text: '你好',
            moodPrompt: '开心挥手',
            status: 'pending',
            animation: AnimationType.NONE
          }]);
          setActiveDraftIndex(0);
          setCurrentView(AppView.MEME_EDITOR);
        } else {
          setCurrentView(AppView.EDIT);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Regular Scene Extension
  const handleGenerate = async () => {
    if (isQuotaReached()) {
      setErrorMsg(`今日额度（${getLimit()}次）已用完，请升级会员或明日再来。`);
      return;
    }

    if (!sourceImage || !prompt) {
      setErrorMsg("请上传图片并输入创意描述");
      return;
    }

    setLoadingState(LoadingState.GENERATING);
    setCurrentView(AppView.RESULT);
    setErrorMsg(null);

    try {
      let finalPrompt = prompt;
      let styleLabels = "";
      if (selectedStyles.length > 0) {
        const styleObjs = selectedStyles.map(id => PRESET_STYLES.find(s => s.id === id));
        const styleKeywords = styleObjs.map(s => s?.value).filter(Boolean).join(', ');
        styleLabels = styleObjs.map(s => s?.label).join(', ');
        if (styleKeywords) {
          finalPrompt = `${prompt}. Style modifiers: ${styleKeywords}`;
        }
      }

      const result = await generateExtendedScene(sourceImage, mimeType, finalPrompt, aspectRatio, imageSize, imageFormat);
      updateUsage(1);

      const newHistoryItem: GeneratedImage = {
        id: Date.now().toString(),
        url: result,
        timestamp: Date.now(),
        prompt: prompt, 
        style: styleLabels
      };

      setHistory(prev => [newHistoryItem, ...prev].slice(0, MAX_HISTORY_ITEMS));
      setResultImage(result);
      setLoadingState(LoadingState.SUCCESS);
    } catch (err) {
      console.error(err);
      setLoadingState(LoadingState.ERROR);
      setErrorMsg("生成失败，可能是图片过大或网络繁忙。请重试。");
    }
  };

  // Meme Generation (Batch or Single)
  const handleGenerateMemes = async () => {
    const pendingCount = memeDrafts.filter(d => d.status === 'pending' || d.status === 'error').length;
    
    if (pendingCount === 0) return;

    if (isQuotaReached(pendingCount)) {
      alert(`额度不足！本次需消耗 ${pendingCount} 次，剩余 ${remainingQuota()} 次。`);
      return;
    }

    // Update UI to generating
    setMemeDrafts(prev => prev.map(d => 
      (d.status === 'pending' || d.status === 'error') ? { ...d, status: 'generating' } : d
    ));

    // Process one by one to allow partial updates
    for (let i = 0; i < memeDrafts.length; i++) {
      const draft = memeDrafts[i];
      if (draft.status !== 'pending' && draft.status !== 'error') continue;

      try {
        const resultUrl = await generateSticker(draft.sourceUrl, draft.moodPrompt);
        
        setMemeDrafts(prev => {
          const next = [...prev];
          next[i] = { ...next[i], generatedUrl: resultUrl, status: 'done' };
          return next;
        });
        updateUsage(1);
      } catch (e) {
        setMemeDrafts(prev => {
          const next = [...prev];
          next[i] = { ...next[i], status: 'error' };
          return next;
        });
      }
    }
  };

  const handleReset = () => {
    setSourceImage(null);
    setPrompt('');
    setSelectedStyles([]);
    setResultImage(null);
    setLoadingState(LoadingState.IDLE);
    setCurrentView(AppView.UPLOAD);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  // Batch Selection Handlers
  const toggleHistorySelection = (id: string) => {
    if (selectedHistoryIds.includes(id)) {
      setSelectedHistoryIds(prev => prev.filter(x => x !== id));
    } else {
      if (selectedHistoryIds.length >= 9) {
        alert("最多选择 9 张图片");
        return;
      }
      setSelectedHistoryIds(prev => [...prev, id]);
    }
  };

  const startBatchMemeCreation = () => {
    const selectedItems = history.filter(h => selectedHistoryIds.includes(h.id));
    if (selectedItems.length === 0) return;

    const drafts: MemeDraft[] = selectedItems.map(item => ({
      id: Date.now() + Math.random().toString(),
      sourceUrl: item.url,
      generatedUrl: null,
      text: '配文',
      moodPrompt: '可爱的表情',
      status: 'pending',
      animation: AnimationType.NONE
    }));

    setMemeDrafts(drafts);
    setActiveDraftIndex(0);
    setIsSelectionMode(false);
    setSelectedHistoryIds([]);
    setCurrentView(AppView.MEME_EDITOR);
  };

  const applyMoodPack = (packId: string) => {
    setSelectedMoodPack(packId);
    if (packId === 'custom') return;

    const pack = MOOD_PACKS.find(p => p.id === packId);
    if (!pack) return;

    setMemeDrafts(prev => prev.map((draft, idx) => {
      // Cycle through pack items
      const moodItem = pack.items[idx % pack.items.length];
      return {
        ...draft,
        text: moodItem.text,
        moodPrompt: moodItem.prompt,
        status: 'pending' // Reset status to allow regeneration
      };
    }));
  };

  // GIF Generation Logic
  const createGif = async (draft: MemeDraft, width = 240, height = 240): Promise<string> => {
    return new Promise((resolve, reject) => {
      if (draft.animation === AnimationType.NONE || !draft.generatedUrl) {
        // Fallback for none is just the image rendering logic, but we handle that in exportWeChatPackage
        reject("No animation");
        return;
      }

      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = draft.generatedUrl;

      img.onload = () => {
        // Generate Frames
        const frames: string[] = [];
        const numFrames = 10; // 10 frames for smoothness
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        
        if (!ctx) return;

        // Pre-calculate text props
        ctx.font = "bold 24px sans-serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        
        // Helper to draw single frame
        const drawFrame = (frameIndex: number) => {
          ctx.clearRect(0, 0, width, height);
          ctx.save();
          
          // Calculate Transforms based on Animation Type
          let scale = 1;
          let rotate = 0;
          let tx = 0;
          let ty = 0;
          const t = frameIndex / numFrames; // 0 to 1

          if (draft.animation === AnimationType.SHAKE) {
             const offset = 4;
             if (frameIndex % 2 === 0) {
               tx = offset; rotate = 2;
             } else {
               tx = -offset; rotate = -2;
             }
          } else if (draft.animation === AnimationType.PULSE) {
             // Sine wave scale
             scale = 1 + Math.sin(t * Math.PI * 2) * 0.1;
          } else if (draft.animation === AnimationType.ZOOM) {
             scale = 1 + t * 0.2;
          } else if (draft.animation === AnimationType.SPIN) {
             rotate = t * 360;
          }

          // Apply Transform to Center
          ctx.translate(width/2, height/2);
          ctx.rotate((rotate * Math.PI) / 180);
          ctx.scale(scale, scale);
          ctx.translate(-width/2, -height/2);

          // Draw Image (fit contain logic)
          const imgScale = Math.min(240 / img.width, 200 / img.height);
          const w = img.width * imgScale;
          const h = img.height * imgScale;
          const x = (240 - w) / 2;
          const y = (200 - h) / 2;
          ctx.drawImage(img, x, y, w, h);

          ctx.restore();

          // Draw Text (Static on top)
          ctx.fillStyle = "white";
          ctx.strokeStyle = "black";
          ctx.lineWidth = 4;
          ctx.lineJoin = "round";
          ctx.strokeText(draft.text, 120, 220);
          ctx.fillText(draft.text, 120, 220);

          frames.push(canvas.toDataURL('image/png'));
        };

        for(let i=0; i<numFrames; i++) {
          drawFrame(i);
        }

        // Call gifshot
        if (typeof gifshot !== 'undefined') {
          gifshot.createGIF({
            images: frames,
            gifWidth: width,
            gifHeight: height,
            interval: 0.1, // 100ms per frame
            numFrames: numFrames,
          }, (obj: any) => {
            if (!obj.error) {
              resolve(obj.image); // Base64 GIF
            } else {
              reject(obj.errorMsg);
            }
          });
        } else {
          reject("gifshot library not loaded");
        }
      };
      img.onerror = reject;
    });
  };

  // Export Logic
  const exportWeChatPackage = async () => {
    setIsExporting(true);
    try {
      const zip = new JSZip();
      const completedDrafts = memeDrafts.filter(d => d.status === 'done' && d.generatedUrl);

      if (completedDrafts.length === 0) {
        alert("没有可导出的已完成表情包");
        return;
      }

      // Create canvas for static images
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      canvas.width = 240;
      canvas.height = 240;

      for (let i = 0; i < completedDrafts.length; i++) {
        const draft = completedDrafts[i];
        if (!draft.generatedUrl) continue;

        if (draft.animation !== AnimationType.NONE) {
          // Generate GIF
          try {
            const gifBase64 = await createGif(draft);
            const base64Data = gifBase64.split(',')[1];
            zip.file(`sticker_${i + 1}.gif`, base64Data, { base64: true });
          } catch (e) {
            console.error("GIF gen failed", e);
            // Fallback to PNG logic below? No, just skip or warn.
          }
        } else {
          // Generate Static PNG
          const img = new Image();
          img.crossOrigin = "anonymous"; 
          img.src = draft.generatedUrl;
          
          await new Promise((resolve) => {
            img.onload = () => {
              ctx.clearRect(0, 0, 240, 240);
              
              const scale = Math.min(240 / img.width, 200 / img.height);
              const w = img.width * scale;
              const h = img.height * scale;
              const x = (240 - w) / 2;
              const y = (200 - h) / 2;
              
              ctx.drawImage(img, x, y, w, h);

              ctx.font = "bold 24px sans-serif";
              ctx.textAlign = "center";
              ctx.textBaseline = "middle";
              ctx.fillStyle = "white";
              ctx.strokeStyle = "black";
              ctx.lineWidth = 4;
              ctx.lineJoin = "round";
              
              ctx.strokeText(draft.text, 120, 220);
              ctx.fillText(draft.text, 120, 220);

              const dataUrl = canvas.toDataURL("image/png");
              const base64Data = dataUrl.split(',')[1];
              zip.file(`sticker_${i + 1}.png`, base64Data, { base64: true });
              resolve(null);
            };
          });
        }
      }

      zip.file("README.txt", "这些表情包由 IP 创想坊 AI 生成。\nGIF 建议直接发送给文件助手再添加表情。");

      const content = await zip.generateAsync({ type: "blob" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(content);
      link.download = `表情包打包_${Date.now()}.zip`;
      link.click();
    } finally {
      setIsExporting(false);
    }
  };

  // --- Render Views ---

  const renderHome = () => (
    <div className="flex flex-col h-screen bg-gradient-to-b from-white to-violet-50 overflow-y-auto no-scrollbar">
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-8">
        <div className="relative w-32 h-32">
          <div className="absolute inset-0 bg-violet-500 rounded-full opacity-20 blur-2xl animate-pulse"></div>
          <div className="relative bg-white p-6 rounded-3xl shadow-xl shadow-violet-100 ring-1 ring-gray-100 rotate-3 hover:rotate-0 transition-transform duration-500">
             <Wand2 className="w-16 h-16 text-violet-600" />
          </div>
        </div>
        
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
            IP 创想坊
          </h1>
          <p className="text-gray-500 max-w-xs mx-auto leading-relaxed text-sm">
            AI 赋能创意，一键生成场景与表情包
          </p>
        </div>

        <div className="w-full max-w-xs space-y-4">
          {/* Main Action */}
          <button 
            onClick={() => setCurrentView(AppView.UPLOAD)}
            className="group relative w-full bg-violet-600 text-white px-8 py-4 rounded-2xl font-semibold shadow-lg shadow-violet-200 active:scale-95 transition-all overflow-hidden flex items-center justify-between"
          >
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
            <div className="flex items-center gap-3 relative z-10">
              <div className="p-2 bg-white/20 rounded-lg">
                 <Sparkles size={20} />
              </div>
              <div className="text-left">
                <div className="text-sm font-bold">场景扩展</div>
                <div className="text-[10px] opacity-80">换背景 / 讲故事</div>
              </div>
            </div>
            <ChevronRight size={20} className="relative z-10 opacity-60" />
          </button>

          {/* Meme Action */}
          <button 
            onClick={() => {
              // To Meme Maker with upload trigger
              triggerFileInput();
              // View change happens in handleFileChange if on HOME
            }}
            className="group relative w-full bg-white text-gray-800 px-8 py-4 rounded-2xl font-semibold shadow-md border border-gray-100 active:scale-95 transition-all flex items-center justify-between hover:border-amber-200"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-100 text-amber-600 rounded-lg">
                 <Smile size={20} />
              </div>
              <div className="text-left">
                <div className="text-sm font-bold">表情包制作</div>
                <div className="text-[10px] text-gray-400">转贴纸 / 批量生成</div>
              </div>
            </div>
            <ChevronRight size={20} className="text-gray-300" />
          </button>
        </div>
        
        <input 
          type="file" 
          ref={fileInputRef} 
          className="hidden" 
          accept="image/png, image/jpeg, image/webp"
          onChange={handleFileChange}
        />
      </div>
      <div className="h-20"></div>
    </div>
  );

  const renderUpload = () => (
    <div className="flex flex-col min-h-screen bg-gray-50 pb-24">
      <header className="bg-white p-4 sticky top-0 z-10 shadow-sm border-b border-gray-100 flex items-center justify-center relative">
        <button 
            onClick={() => setCurrentView(AppView.HOME)}
            className="absolute left-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
            <ChevronLeft size={24} className="text-gray-600" />
        </button>
        <h2 className="font-bold text-lg text-gray-800">上传素材</h2>
      </header>
      
      <div className="flex-1 p-6 flex flex-col justify-center">
        <div 
          onClick={triggerFileInput}
          className="bg-white border-2 border-dashed border-violet-200 rounded-3xl p-10 flex flex-col items-center justify-center space-y-4 cursor-pointer hover:bg-violet-50 hover:border-violet-400 transition-all group min-h-[320px]"
        >
          <div className="w-16 h-16 bg-violet-100 text-violet-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
            <UploadCloud size={32} />
          </div>
          <div className="text-center space-y-2">
            <p className="font-semibold text-gray-700">点击上传图片</p>
            <p className="text-xs text-gray-400">支持 JPG, PNG (最大 5MB)</p>
          </div>
          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            accept="image/png, image/jpeg, image/webp"
            onChange={handleFileChange}
          />
        </div>
      </div>
    </div>
  );

  const renderEdit = () => {
    const quotaReached = isQuotaReached();
    
    return (
      <div className="flex flex-col min-h-screen bg-gray-50 pb-24">
        <header className="bg-white px-4 py-3 sticky top-0 z-10 shadow-sm border-b border-gray-100 flex items-center gap-4">
          <button 
            onClick={() => setCurrentView(AppView.UPLOAD)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ChevronLeft size={24} className="text-gray-600" />
          </button>
          <h2 className="font-bold text-lg text-gray-800">创意工坊</h2>
          <div className="ml-auto">
             <div className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full border ${quotaReached ? 'bg-red-50 text-red-500 border-red-100' : 'bg-violet-50 text-violet-600 border-violet-100'}`}>
               <Zap size={12} fill="currentColor" />
               {remainingQuota()} / {getLimit()}
             </div>
          </div>
        </header>

        <div className="flex-1 p-6 space-y-6 overflow-y-auto">
          <div className="bg-white p-2 rounded-2xl shadow-sm border border-gray-100">
            {sourceImage && (
              <img 
                src={sourceImage} 
                alt="Preview" 
                className="w-full h-48 object-contain bg-gray-100 rounded-xl" 
              />
            )}
          </div>

          <div className="space-y-3">
             <label className="text-sm font-semibold text-gray-800 ml-1 flex items-center gap-2">
               <Sparkles size={16} className="text-violet-500" />
               你想如何扩展这个场景？
             </label>
             <div className="relative">
               <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="例如：让这只猫咪坐在充满未来感的霓虹城市街道上，下着小雨..."
                className="w-full p-4 pb-12 rounded-2xl border border-gray-200 bg-white focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none resize-none text-gray-700 shadow-sm h-32 text-sm leading-relaxed"
               />
             </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-semibold text-gray-800 ml-1 flex items-center gap-2">
                <Palette size={16} className="text-violet-500" />
                艺术风格 (多选)
              </label>
              {selectedStyles.length > 0 && (
                <span className="text-xs text-violet-600 bg-violet-50 px-2 py-1 rounded-lg font-medium">
                  已选 {selectedStyles.length} 个
                </span>
              )}
            </div>
             <div className="grid grid-cols-3 gap-3">
                {PRESET_STYLES.map((style) => {
                  const isSelected = selectedStyles.includes(style.id);
                  return (
                    <button
                      key={style.id}
                      onClick={() => toggleStyle(style.id)}
                      className={`
                        relative px-2 py-3 rounded-xl text-xs font-medium transition-all duration-200 border
                        flex flex-col items-center justify-center gap-1 overflow-hidden
                        ${isSelected 
                          ? 'bg-violet-50 border-violet-500 text-violet-700 shadow-sm ring-1 ring-violet-200' 
                          : 'bg-white border-gray-200 text-gray-600 hover:border-violet-200 hover:bg-gray-50'
                        }
                      `}
                    >
                      {isSelected && (
                         <div className="absolute top-1 right-1">
                           <Check size={12} className="text-violet-600" />
                         </div>
                      )}
                      <span>{style.label}</span>
                    </button>
                  );
                })}
             </div>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-semibold text-gray-800 ml-1 flex items-center gap-2">
              <ImageIcon size={16} className="text-violet-500" />
              图片比例
            </label>
            <div className="grid grid-cols-5 gap-2">
              {["1:1", "16:9", "9:16", "4:3", "3:4", "21:9", "3:2", "2:3", "5:4", "4:5"].map((ratio) => (
                <button
                  key={ratio}
                  onClick={() => setAspectRatio(ratio)}
                  className={`
                    px-3 py-2 rounded-xl text-xs font-medium transition-all border
                    ${aspectRatio === ratio
                      ? 'bg-violet-50 border-violet-500 text-violet-700 shadow-sm ring-1 ring-violet-200'
                      : 'bg-white border-gray-200 text-gray-600 hover:border-violet-200 hover:bg-gray-50'
                    }
                  `}
                >
                  {ratio}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-semibold text-gray-800 ml-1 flex items-center gap-2">
              <ImageIcon size={16} className="text-violet-500" />
              分辨率
            </label>
            <div className="grid grid-cols-3 gap-3">
              {(["1K", "2K", "4K"] as const).map((size) => (
                <button
                  key={size}
                  onClick={() => setImageSize(size)}
                  className={`
                    px-4 py-3 rounded-xl text-sm font-medium transition-all border
                    ${imageSize === size
                      ? 'bg-violet-50 border-violet-500 text-violet-700 shadow-sm ring-1 ring-violet-200'
                      : 'bg-white border-gray-200 text-gray-600 hover:border-violet-200 hover:bg-gray-50'
                    }
                  `}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-semibold text-gray-800 ml-1 flex items-center gap-2">
              <ImageIcon size={16} className="text-violet-500" />
              图片格式
            </label>
            <div className="grid grid-cols-3 gap-3">
              {(["PNG", "JPEG", "WEBP"] as const).map((format) => (
                <button
                  key={format}
                  onClick={() => setImageFormat(format)}
                  className={`
                    px-4 py-3 rounded-xl text-sm font-medium transition-all border
                    ${imageFormat === format
                      ? 'bg-violet-50 border-violet-500 text-violet-700 shadow-sm ring-1 ring-violet-200'
                      : 'bg-white border-gray-200 text-gray-600 hover:border-violet-200 hover:bg-gray-50'
                    }
                  `}
                >
                  {format}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="px-6 pb-4 pt-2 bg-gradient-to-t from-gray-50 to-transparent">
          <button 
            onClick={handleGenerate}
            disabled={!prompt.trim() || quotaReached}
            className={`w-full py-4 rounded-2xl font-semibold shadow-lg flex items-center justify-center gap-2 transition-all active:scale-95
              ${(!prompt.trim() || quotaReached)
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
                : 'bg-violet-600 text-white shadow-violet-200 hover:bg-violet-700'
              }`}
          >
            {quotaReached ? (
              <span>今日额度已用完</span>
            ) : (
              <>
                <Sparkles size={18} />
                立即生成
              </>
            )}
          </button>
          {quotaReached && (
            <p onClick={() => setCurrentView(AppView.PROFILE)} className="text-center text-xs text-violet-600 mt-2 cursor-pointer hover:underline">
              升级会员获取更多额度 &rarr;
            </p>
          )}
        </div>
      </div>
    );
  };

  const renderResult = () => (
    <div className="flex flex-col min-h-screen bg-gray-900 pb-24">
       <header className="bg-transparent px-4 py-3 absolute top-0 left-0 right-0 z-20 flex items-center justify-between">
        <button 
          onClick={() => setCurrentView(AppView.EDIT)}
          className="p-2 bg-black/20 backdrop-blur-md rounded-full text-white hover:bg-black/40 transition-colors"
        >
          <ChevronLeft size={24} />
        </button>
      </header>

      <div className="flex-1 flex items-center justify-center p-4 relative">
        {loadingState === LoadingState.GENERATING && (
          <div className="text-white">
            <Loader message="正在为你的IP构建新世界..." />
          </div>
        )}

        {loadingState === LoadingState.ERROR && (
          <div className="text-center space-y-4 bg-white/10 p-8 rounded-3xl backdrop-blur-md border border-white/10">
            <div className="text-red-400 text-5xl mb-2">:(</div>
            <p className="text-white/90 font-medium">{errorMsg}</p>
            <button 
              onClick={() => setCurrentView(AppView.EDIT)}
              className="px-6 py-2 bg-white text-gray-900 rounded-full text-sm font-semibold hover:bg-gray-100"
            >
              返回修改
            </button>
          </div>
        )}

        {loadingState === LoadingState.SUCCESS && resultImage && (
          <div className="w-full max-w-md animate-in fade-in zoom-in duration-500">
             <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-violet-900/50 border border-white/10 bg-gray-800">
                <img 
                  src={resultImage} 
                  alt="Generated" 
                  className="w-full h-auto max-h-[70vh] object-contain" 
                />
             </div>
             <div className="mt-6 grid grid-cols-2 gap-3">
                <a 
                  href={resultImage} 
                  download={`ip-creative-${Date.now()}.png`}
                  className="col-span-2 bg-white text-gray-900 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-gray-100 transition-colors"
                >
                  <Download size={18} /> 保存图片
                </a>
                <button 
                  onClick={() => {
                     // Initialize single draft
                     setMemeDrafts([{
                       id: Date.now().toString(),
                       sourceUrl: resultImage!,
                       generatedUrl: null,
                       text: '神评',
                       moodPrompt: '滑稽表情',
                       status: 'pending',
                       animation: AnimationType.NONE
                     }]);
                     setActiveDraftIndex(0);
                     setCurrentView(AppView.MEME_EDITOR);
                  }}
                  className="bg-amber-400 text-amber-900 border border-amber-500/20 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-amber-300 transition-colors"
                >
                  <Smile size={18} /> 转表情包
                </button>
                <button 
                  onClick={handleReset}
                  className="bg-gray-800 text-white border border-gray-700 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-gray-700 transition-colors"
                >
                  <RefreshCcw size={18} /> 再来一次
                </button>
             </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderMemeEditor = () => {
    const activeDraft = memeDrafts[activeDraftIndex];
    const pendingCount = memeDrafts.filter(d => d.status === 'pending' || d.status === 'error').length;
    
    // Animation Preview Class
    let animClass = '';
    if (activeDraft.animation === AnimationType.SHAKE) animClass = 'animate-shake';
    if (activeDraft.animation === AnimationType.PULSE) animClass = 'animate-pulse-fast';
    if (activeDraft.animation === AnimationType.ZOOM) animClass = 'animate-zoom';
    if (activeDraft.animation === AnimationType.SPIN) animClass = 'animate-spin-slow';

    return (
      <div className="flex flex-col min-h-screen bg-gray-50 pb-0">
        <header className="bg-white px-4 py-3 shadow-sm border-b border-gray-100 flex items-center justify-between">
          <button 
            onClick={() => setCurrentView(AppView.PROFILE)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ChevronLeft size={24} className="text-gray-600" />
          </button>
          <h2 className="font-bold text-lg text-gray-800">表情包工坊</h2>
          <div className="w-8"></div>
        </header>

        {/* Preview Area */}
        <div className="flex-1 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-gray-100 p-6 flex flex-col items-center justify-center relative">
          <div className="w-64 h-64 bg-white rounded-lg shadow-xl border-4 border-white relative flex items-center justify-center">
             <div className={`w-full h-full relative overflow-hidden ${animClass}`}>
                {activeDraft.generatedUrl ? (
                  <>
                    <img src={activeDraft.generatedUrl} className="w-full h-full object-contain p-4" />
                    {/* Text Overlay Simulation for Preview */}
                    <div className="absolute bottom-4 left-0 right-0 text-center pointer-events-none">
                        <span className="text-2xl font-bold text-white stroke-black drop-shadow-md" style={{ textShadow: '2px 2px 0 #000, -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000' }}>
                          {activeDraft.text}
                        </span>
                    </div>
                  </>
                ) : (
                  <div className="text-center p-4 opacity-50">
                    <img src={activeDraft.sourceUrl} className="w-full h-full object-contain opacity-30 blur-sm" />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <span className="bg-gray-800 text-white px-3 py-1 rounded-full text-xs">等待生成</span>
                    </div>
                  </div>
                )}
            </div>
            
            {/* Status Indicator */}
            {activeDraft.status === 'generating' && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10 rounded-md">
                <Loader message="" />
              </div>
            )}
          </div>
          
          {/* Thumbnails for Batch */}
          {memeDrafts.length > 1 && (
            <div className="mt-6 flex gap-2 overflow-x-auto max-w-full p-2 bg-white/50 rounded-xl backdrop-blur-md">
               {memeDrafts.map((draft, idx) => (
                 <div 
                   key={draft.id}
                   onClick={() => setActiveDraftIndex(idx)}
                   className={`w-12 h-12 rounded-lg border-2 flex-shrink-0 overflow-hidden cursor-pointer relative ${idx === activeDraftIndex ? 'border-violet-600 ring-2 ring-violet-200' : 'border-gray-200'}`}
                 >
                   <img src={draft.generatedUrl || draft.sourceUrl} className="w-full h-full object-cover" />
                   {draft.status === 'done' && <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border border-white"></div>}
                 </div>
               ))}
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="bg-white p-6 rounded-t-3xl shadow-[0_-4px_20px_rgba(0,0,0,0.05)] space-y-5 max-h-[50vh] overflow-y-auto">
           {/* Mood Packs */}
           <div className="space-y-2">
             <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">情绪套餐</label>
             <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
               {MOOD_PACKS.map(pack => (
                 <button
                   key={pack.id}
                   onClick={() => applyMoodPack(pack.id)}
                   className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${selectedMoodPack === pack.id ? 'bg-amber-100 text-amber-700 border border-amber-200' : 'bg-gray-50 text-gray-600 border border-gray-100'}`}
                 >
                   {pack.label}
                 </button>
               ))}
             </div>
           </div>

           {/* Animation Selector */}
           <div className="space-y-2">
              <label className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1">
                <Play size={12} /> 动态特效
              </label>
              <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
                {ANIMATION_OPTIONS.map(anim => (
                   <button
                    key={anim.id}
                    onClick={() => {
                      setMemeDrafts(prev => {
                        const next = [...prev];
                        next[activeDraftIndex] = { ...next[activeDraftIndex], animation: anim.id };
                        return next;
                      });
                    }}
                    className={`px-3 py-2 rounded-lg text-xs font-medium flex items-center gap-2 border transition-colors ${activeDraft.animation === anim.id ? 'bg-violet-50 border-violet-500 text-violet-700' : 'bg-white border-gray-200 text-gray-600'}`}
                   >
                     {anim.icon}
                     {anim.label}
                   </button>
                ))}
              </div>
           </div>

           {/* Inputs */}
           <div className="grid grid-cols-2 gap-4">
             <div className="space-y-2">
               <label className="text-xs font-bold text-gray-500">表情文案</label>
               <input 
                  type="text" 
                  value={activeDraft.text}
                  onChange={(e) => {
                    const newVal = e.target.value;
                    setMemeDrafts(prev => {
                      const next = [...prev];
                      next[activeDraftIndex] = { ...next[activeDraftIndex], text: newVal };
                      return next;
                    });
                  }}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-violet-500 outline-none"
               />
             </div>
             <div className="space-y-2">
               <label className="text-xs font-bold text-gray-500">动作指令</label>
               <input 
                  type="text" 
                  value={activeDraft.moodPrompt}
                  placeholder="例如：大笑、挥手"
                  onChange={(e) => {
                    const newVal = e.target.value;
                    setMemeDrafts(prev => {
                      const next = [...prev];
                      next[activeDraftIndex] = { 
                        ...next[activeDraftIndex], 
                        moodPrompt: newVal,
                        status: 'pending' // Changing prompt requires regeneration
                      };
                      return next;
                    });
                  }}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-violet-500 outline-none"
               />
             </div>
           </div>

           {/* Actions */}
           <div className="flex gap-3 pt-2">
              {pendingCount > 0 ? (
                <button 
                  onClick={handleGenerateMemes}
                  className="flex-1 bg-violet-600 text-white py-3.5 rounded-xl font-bold shadow-lg shadow-violet-200 flex items-center justify-center gap-2 active:scale-95 transition-transform"
                >
                   <Wand2 size={18} /> 
                   {memeDrafts.length > 1 ? `生成全部 (${pendingCount})` : '生成表情'}
                </button>
              ) : (
                 <button 
                  onClick={exportWeChatPackage}
                  disabled={isExporting}
                  className={`flex-1 text-white py-3.5 rounded-xl font-bold shadow-lg shadow-green-200 flex items-center justify-center gap-2 active:scale-95 transition-transform ${isExporting ? 'bg-green-400 cursor-wait' : 'bg-green-500'}`}
                >
                   {isExporting ? <Loader2 className="animate-spin" size={18} /> : <Package size={18} />}
                   {memeDrafts.length > 1 ? '导出表情包 (ZIP)' : '保存表情'}
                </button>
              )}
           </div>
        </div>
      </div>
    );
  };

  const renderProfile = () => {
    const isPremium = userTier === UserTier.PREMIUM;
    const limit = getLimit();
    const used = dailyUsage.date === new Date().toLocaleDateString() ? dailyUsage.count : 0;
    const remaining = Math.max(0, limit - used);
    const percentage = Math.min(100, (used / limit) * 100);

    return (
      <div className="flex flex-col min-h-screen bg-gray-50 pb-24">
        <header className="bg-white p-4 sticky top-0 z-10 shadow-sm border-b border-gray-100 flex items-center justify-between">
          <div className="w-8"></div>
          <h2 className="font-bold text-lg text-gray-800">我的</h2>
          <button 
            onClick={() => {
              if (isSelectionMode) {
                setIsSelectionMode(false);
                setSelectedHistoryIds([]);
              } else {
                setIsSelectionMode(true);
              }
            }}
            className={`text-sm font-medium ${isSelectionMode ? 'text-violet-600' : 'text-gray-500'}`}
          >
            {isSelectionMode ? '取消' : '多选'}
          </button>
        </header>

        <div className="flex-1 p-4 space-y-6 overflow-y-auto">
          {/* User Card (Hide in selection mode to save space) */}
          {!isSelectionMode && (
            <div className={`relative rounded-3xl p-6 text-white overflow-hidden shadow-lg transition-all duration-500 ${isPremium ? 'bg-gradient-to-br from-slate-800 to-slate-900 shadow-slate-200' : 'bg-gradient-to-br from-violet-500 to-violet-600 shadow-violet-200'}`}>
              {isPremium && (
                 <div className="absolute -right-8 -top-8 text-white/10">
                   <Crown size={120} />
                 </div>
              )}
              
              <div className="relative z-10 flex items-center gap-4 mb-6">
                 <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-2xl font-bold border-2 border-white/30">
                   {isPremium ? '💎' : '🎨'}
                 </div>
                 <div>
                   <h3 className="font-bold text-xl">{isPremium ? '尊贵会员' : '普通用户'}</h3>
                   <p className="text-white/80 text-xs flex items-center gap-1 mt-1">
                     ID: 8849302
                     {isPremium && <span className="bg-amber-400 text-amber-900 text-[10px] font-bold px-1.5 rounded">PRO</span>}
                   </p>
                 </div>
              </div>

              <div className="relative z-10 bg-black/20 rounded-2xl p-4 backdrop-blur-sm">
                <div className="flex justify-between items-end mb-2">
                  <span className="text-xs text-white/80">今日剩余额度</span>
                  <span className="font-mono font-bold text-xl">{remaining} <span className="text-sm text-white/60">/ {limit}</span></span>
                </div>
                <div className="w-full bg-white/20 rounded-full h-2 overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${isPremium ? 'bg-amber-400' : 'bg-white'}`} 
                    style={{ width: `${100 - percentage}%` }}
                  ></div>
                </div>
                <p className="text-[10px] text-white/60 mt-2 text-right">每日 00:00 重置</p>
              </div>

              {/* Upgrade Button (Simulation) */}
              <button 
                onClick={() => setUserTier(prev => prev === UserTier.FREE ? UserTier.PREMIUM : UserTier.FREE)}
                className={`mt-4 w-full py-2.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-colors ${isPremium ? 'bg-white/10 hover:bg-white/20 text-white border border-white/20' : 'bg-amber-400 text-amber-900 hover:bg-amber-300 shadow-lg shadow-amber-900/20'}`}
              >
                {isPremium ? (
                  <>
                    <LogOut size={16} /> 切换回普通版 (测试)
                  </>
                ) : (
                  <>
                    <Crown size={16} /> 升级会员 (每日 50 次)
                  </>
                )}
              </button>
            </div>
          )}

          {/* History Section */}
          <div>
            <div className="flex items-center justify-between mb-3 px-1">
               <h3 className="font-bold text-gray-800 flex items-center gap-2">
                 <Clock size={18} className="text-violet-500" /> 
                 {isSelectionMode ? '请选择图片 (1-9张)' : '创作历史'}
               </h3>
               {history.length > 0 && !isSelectionMode && (
                 <span className="text-xs text-gray-400">最近 {history.length} 条</span>
               )}
            </div>

            {history.length === 0 ? (
              <div className="bg-white rounded-2xl p-8 border border-gray-100 flex flex-col items-center justify-center text-gray-400 space-y-4">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center">
                  <ImageIcon size={24} className="text-gray-300" />
                </div>
                <p className="text-sm">暂无作品，去创作你的第一张画吧！</p>
                <button 
                  onClick={() => setCurrentView(AppView.UPLOAD)}
                  className="text-violet-600 text-sm font-semibold hover:underline"
                >
                  立即创作
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4 pb-20">
                {history.map((item) => (
                  <div 
                    key={item.id} 
                    onClick={() => {
                      if (isSelectionMode) {
                        toggleHistorySelection(item.id);
                      } else {
                        setViewingHistoryItem(item);
                      }
                    }}
                    className={`
                      bg-white rounded-2xl overflow-hidden shadow-sm border flex flex-col transition-all cursor-pointer group relative
                      ${isSelectionMode && selectedHistoryIds.includes(item.id) ? 'border-violet-500 ring-2 ring-violet-200' : 'border-gray-100'}
                    `}
                  >
                    <div className="relative aspect-square bg-gray-100 overflow-hidden">
                      <img src={item.url} alt="History" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      {/* Selection Indicator */}
                      {isSelectionMode && (
                        <div className="absolute top-2 right-2">
                           {selectedHistoryIds.includes(item.id) ? (
                             <div className="bg-violet-600 text-white rounded-full p-1 shadow-md"><Check size={16} /></div>
                           ) : (
                             <div className="bg-white/80 rounded-full p-1 shadow-sm"><Square size={16} className="text-gray-400" /></div>
                           )}
                        </div>
                      )}
                    </div>
                    <div className="p-3">
                      <p className="text-xs text-gray-800 font-medium line-clamp-2 mb-1">{item.prompt}</p>
                      <div className="flex items-center justify-between text-[10px] text-gray-400">
                          <span>{new Date(item.timestamp).toLocaleDateString(undefined, { month: 'numeric', day: 'numeric' })}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Batch Action Bar */}
        {isSelectionMode && selectedHistoryIds.length > 0 && (
          <div className="fixed bottom-20 left-4 right-4 bg-white rounded-2xl shadow-xl shadow-violet-900/10 p-4 border border-violet-100 flex items-center justify-between z-50 animate-in slide-in-from-bottom-4">
             <div className="text-sm font-medium text-gray-600">
               已选 <span className="text-violet-600 font-bold">{selectedHistoryIds.length}</span> 张
             </div>
             <button 
               onClick={startBatchMemeCreation}
               className="bg-violet-600 text-white px-6 py-2 rounded-xl text-sm font-bold shadow-lg shadow-violet-200 hover:bg-violet-700 transition-colors flex items-center gap-2"
             >
               <Smile size={16} /> 制作表情包
             </button>
          </div>
        )}

        {/* Full Screen History Viewer Modal */}
        {viewingHistoryItem && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/95 backdrop-blur-sm p-4 animate-in fade-in duration-200">
             <button 
               onClick={() => setViewingHistoryItem(null)}
               className="absolute top-4 right-4 p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-colors"
             >
               <X size={24} />
             </button>
             
             <div className="w-full max-w-lg flex flex-col gap-6">
                <img 
                  src={viewingHistoryItem.url} 
                  className="w-full h-auto max-h-[60vh] object-contain rounded-lg shadow-2xl shadow-violet-900/20"
                />
                
                <div className="space-y-4 px-2">
                  <div className="text-white/80 space-y-1">
                    <p className="text-xs text-white/40">提示词</p>
                    <p className="text-sm font-medium">{viewingHistoryItem.prompt}</p>
                  </div>
                  
                  <div className="flex gap-3">
                    <a 
                      href={viewingHistoryItem.url} 
                      download={`history-${viewingHistoryItem.id}.png`}
                      className="flex-1 bg-white text-gray-900 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2"
                    >
                      <Download size={16} /> 保存
                    </a>
                    <button
                      onClick={() => {
                         setHistory(prev => prev.filter(item => item.id !== viewingHistoryItem.id));
                         setViewingHistoryItem(null);
                      }}
                      className="flex-none bg-red-500/10 text-red-400 border border-red-500/20 py-3 px-4 rounded-xl flex items-center justify-center hover:bg-red-500/20 transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
             </div>
          </div>
        )}
      </div>
    );
  };

  const toggleStyle = (styleId: string) => {
    setSelectedStyles(prev => {
      if (prev.includes(styleId)) {
        return prev.filter(id => id !== styleId);
      } else {
        return [...prev, styleId];
      }
    });
  };

  return (
    <div className="font-sans min-h-screen bg-gray-50">
      {currentView === AppView.HOME && renderHome()}
      {currentView === AppView.UPLOAD && renderUpload()}
      {currentView === AppView.EDIT && renderEdit()}
      {currentView === AppView.RESULT && renderResult()}
      {currentView === AppView.PROFILE && renderProfile()}
      {currentView === AppView.MEME_EDITOR && renderMemeEditor()}

      {currentView !== AppView.RESULT && currentView !== AppView.MEME_EDITOR && !viewingHistoryItem && (
        <TabBar currentView={currentView} onChangeView={setCurrentView} />
      )}
    </div>
  );
};

export default App;