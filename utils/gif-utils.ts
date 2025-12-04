import { AnimationType, MemeDraft } from "@/types";
import { getProxiedImageUrl } from "@/lib/image-storage";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile } from "@ffmpeg/util";

export interface GifConfig {
  width?: number;
  height?: number;
  withBackground?: boolean;
}

/**
 * 获取动画配置
 */
export function getAnimationConfig(animation: AnimationType): {
  numFrames: number;
  framesPerCycle: number;
  frameDelay: number;
} {
  const frameDelay = 50; // 50ms per frame
  let numFrames: number;
  let framesPerCycle: number;

  switch (animation) {
    case AnimationType.SHAKE:
      framesPerCycle = 10;
      numFrames = framesPerCycle * 2; // 20 frames (减少循环次数)
      break;
    case AnimationType.PULSE:
      framesPerCycle = 16;
      numFrames = framesPerCycle * 2; // 32 frames
      break;
    case AnimationType.ZOOM:
      framesPerCycle = 30;
      numFrames = framesPerCycle; // 30 frames
      break;
    case AnimationType.BOUNCE:
      framesPerCycle = 12;
      numFrames = framesPerCycle * 2; // 24 frames
      break;
    case AnimationType.WIGGLE:
      framesPerCycle = 8;
      numFrames = framesPerCycle * 3; // 24 frames
      break;
    case AnimationType.FADE:
      framesPerCycle = 20;
      numFrames = framesPerCycle * 2; // 40 frames
      break;
    case AnimationType.FLIP:
      framesPerCycle = 20;
      numFrames = framesPerCycle * 2; // 40 frames
      break;
    case AnimationType.SWING:
      framesPerCycle = 20;
      numFrames = framesPerCycle * 2; // 40 frames
      break;
    case AnimationType.ROTATE:
      framesPerCycle = 30;
      numFrames = framesPerCycle; // 30 frames
      break;
    default:
      numFrames = 30;
      framesPerCycle = 30;
  }

  return { numFrames, framesPerCycle, frameDelay };
}

/**
 * 计算动画变换参数
 */
export function calculateAnimationTransform(
  animation: AnimationType,
  frameInCycle: number,
  framesPerCycle: number
): { scale: number; tx: number; ty: number; rotate: number; opacity: number } {
  const t = frameInCycle / framesPerCycle;
  let scale = 1;
  let tx = 0;
  let ty = 0;
  let rotate = 0;
  let opacity = 1;

  switch (animation) {
    case AnimationType.SHAKE: {
      const amplitudeX = 5;
      const amplitudeY = 5;
      const amplitudeRotate = 5;
      if (t < 0.25) {
        const p = t / 0.25;
        tx = -amplitudeX * p;
        ty = amplitudeY * p;
        rotate = -amplitudeRotate * p;
      } else if (t < 0.5) {
        const p = (t - 0.25) / 0.25;
        tx = -amplitudeX + amplitudeX * p * 2;
        ty = amplitudeY - amplitudeY * p * 2;
        rotate = -amplitudeRotate + amplitudeRotate * p * 2;
      } else if (t < 0.75) {
        const p = (t - 0.5) / 0.25;
        tx = amplitudeX - amplitudeX * p * 2;
        ty = -amplitudeY + amplitudeY * p * 2;
        rotate = amplitudeRotate - amplitudeRotate * p * 2;
      } else {
        const p = (t - 0.75) / 0.25;
        tx = -amplitudeX + amplitudeX * p;
        ty = amplitudeY - amplitudeY * p;
        rotate = -amplitudeRotate + amplitudeRotate * p;
      }
      break;
    }
    case AnimationType.PULSE: {
      const minScale = 0.9;
      const maxScale = 1.1;
      scale = minScale + (maxScale - minScale) * (0.5 + 0.5 * Math.sin(t * Math.PI * 2));
      break;
    }
    case AnimationType.ZOOM: {
      const minScale = 0.8;
      const maxScale = 1.2;
      scale = minScale + (maxScale - minScale) * (0.5 + 0.5 * Math.sin(t * Math.PI * 2));
      break;
    }
    case AnimationType.BOUNCE: {
      const amplitude = 15;
      ty = -amplitude * Math.abs(Math.sin(t * Math.PI * 2));
      break;
    }
    case AnimationType.WIGGLE: {
      const amplitude = 8;
      rotate = amplitude * Math.sin(t * Math.PI * 4);
      break;
    }
    case AnimationType.FADE: {
      opacity = 0.5 + 0.5 * Math.sin(t * Math.PI * 2);
      break;
    }
    case AnimationType.FLIP: {
      // Flip animation - scale horizontally (handled in main loop)
      break;
    }
    case AnimationType.SWING: {
      const amplitude = 15;
      rotate = amplitude * Math.sin(t * Math.PI * 2);
      break;
    }
    case AnimationType.ROTATE: {
      rotate = t * 360;
      break;
    }
  }

  return { scale, tx, ty, rotate, opacity };
}

/**
 * 创建 GIF（使用 FFmpeg）
 */
export async function createGifWithFFmpeg(
  draft: MemeDraft,
  ffmpeg: FFmpeg,
  processedImageRef: React.MutableRefObject<{ [key: string]: string }>,
  config: GifConfig & { skipText?: boolean; sourceImageUrl?: string } = {}
): Promise<string> {
  const { width = 240, height = 240, withBackground = true, skipText = false, sourceImageUrl } = config;

  // 即使没有动画，也生成静态 GIF（只有一帧）
  const hasAnimation = draft.animation && draft.animation !== AnimationType.NONE;

  if (!draft.generatedUrl && !draft.sourceUrl) {
    return "";
  }

  // 如果没有动画，使用单帧配置
  const { numFrames, framesPerCycle, frameDelay } = hasAnimation
    ? getAnimationConfig(draft.animation)
    : { numFrames: 1, framesPerCycle: 1, frameDelay: 100 };

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d", { alpha: true });
  if (!ctx) throw new Error("Failed to get canvas context");

  // Determine image source priority:
  // 1. Explicitly provided sourceImageUrl (e.g. specific group processed image)
  // 2. Processed image from ref (if removeBackground is true and exists)
  // 3. Generated URL (if exists)
  // 4. Source URL (fallback)
  let imageToUse = sourceImageUrl;
  
  if (!imageToUse) {
    if (draft.removeBackground && processedImageRef.current[draft.id]) {
      imageToUse = processedImageRef.current[draft.id];
    } else {
      imageToUse = draft.generatedUrl || draft.sourceUrl;
    }
  }

  const img = new Image();
  img.crossOrigin = "anonymous";
  img.src = getProxiedImageUrl(imageToUse);

  await new Promise<void>((resolve, reject) => {
    img.onload = () => resolve();
    img.onerror = () => reject(new Error("Failed to load image"));
  });

  // 根据 canvas 尺寸动态计算文字大小（以 240x240 为基准，24px 字体）
  const fontSize = Math.round((width / 240) * 24);
  const textOffset = Math.round((width / 240) * 20);
  const strokeWidth = Math.round((width / 240) * 4);
  
  ctx.font = `bold ${fontSize}px sans-serif`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  let backgroundColor = "white";
  let useTransparent = false;

  if (!withBackground) {
    // 如果移除了背景，使用透明背景
    if (draft.removeBackground) {
      useTransparent = true;
    } else if (draft.backgroundType === "transparent") {
      backgroundColor = "white";
      useTransparent = true;
    } else if (draft.backgroundType === "color" && draft.backgroundColor) {
      backgroundColor = draft.backgroundColor;
    }
  }

  const frames: Blob[] = [];

  for (let i = 0; i < numFrames; i++) {
    ctx.clearRect(0, 0, width, height);

    if (!useTransparent) {
      ctx.fillStyle = backgroundColor;
      ctx.fillRect(0, 0, width, height);
    }

      ctx.save();

      const frameInCycle = i % framesPerCycle;
      // 如果没有动画，使用默认变换（无变化）
      const transform = hasAnimation
        ? calculateAnimationTransform(draft.animation, frameInCycle, framesPerCycle)
        : { scale: 1, tx: 0, ty: 0, rotate: 0, opacity: 1 };

      ctx.globalAlpha = transform.opacity;
      ctx.translate(width / 2 + transform.tx, height / 2 + transform.ty);
      ctx.rotate((transform.rotate * Math.PI) / 180);
      
      // Handle FLIP animation separately
      if (draft.animation === AnimationType.FLIP) {
        const t = frameInCycle / framesPerCycle;
        const scaleX = t < 0.5 ? 1 - t * 2 : (t - 0.5) * 2;
        ctx.scale(scaleX, transform.scale);
      } else {
        ctx.scale(transform.scale, transform.scale);
      }

    const imgWidth = img.width;
    const imgHeight = img.height;
    const scaleImg = Math.min(width / imgWidth, height / imgHeight);
    const w = imgWidth * scaleImg;
    const h = imgHeight * scaleImg;

    ctx.drawImage(img, -w / 2, -h / 2, w, h);

    // 只有在 skipText 为 false 时才添加文字（用于导出时，因为图片已经包含文字）
    if (!skipText && draft.text) {
      ctx.fillStyle = "white";
      ctx.strokeStyle = "black";
      ctx.lineWidth = strokeWidth;
      // 根据文字位置设置 Y 坐标（坐标系统相对于画布中心）
      const textPosition = draft.textPosition || "bottom";
      const textY = textPosition === "top" 
        ? -(height / 2 - textOffset)  // 上方：从中心向上偏移（负值）
        : height / 2 - textOffset;  // 下方：从中心向下偏移（正值）
      ctx.strokeText(draft.text, 0, textY);
      ctx.fillText(draft.text, 0, textY);
    }

    ctx.restore();

    const blob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (blob) resolve(blob);
        else reject(new Error("Failed to create blob"));
      }, "image/png");
    });

    frames.push(blob);
  }

  // 使用 FFmpeg 创建 GIF
  const outputFile = "output.gif";

  try {
    for (let i = 0; i < frames.length; i++) {
      const frameBlob = frames[i];
      const arrayBuffer = await frameBlob.arrayBuffer();
      await ffmpeg.writeFile(
        `frame_${i.toString().padStart(4, "0")}.png`,
        new Uint8Array(arrayBuffer)
      );
    }

    // 生成调色板，保留透明色以支持透明背景
    await ffmpeg.exec([
      "-framerate",
      `${1000 / frameDelay}`,
      "-i",
      "frame_%04d.png",
      "-vf",
      "palettegen=max_colors=128:reserve_transparent=1",
      "palette.png",
    ]);

    // 使用优化的压缩参数生成 GIF，确保透明背景被保留
    await ffmpeg.exec([
      "-framerate",
      `${1000 / frameDelay}`,
      "-i",
      "frame_%04d.png",
      "-i",
      "palette.png",
      "-lavfi",
      "paletteuse=dither=bayer:bayer_scale=5:diff_mode=rectangle:alpha_threshold=128",
      "-loop",
      "0",
      "-f",
      "gif",
      outputFile,
    ]);

    const fileData = await ffmpeg.readFile(outputFile);
    let data: Uint8Array;

    if (fileData instanceof Uint8Array) {
      data = fileData;
    } else if (typeof fileData === "string") {
      const binaryString = atob(fileData);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      data = bytes;
    } else {
      const fileDataAny = fileData as any;
      if (fileDataAny.buffer) {
        data = new Uint8Array(fileDataAny.buffer);
      } else if (fileDataAny.data) {
        data = new Uint8Array(fileDataAny.data);
      } else {
        throw new Error(`Unexpected file data type: ${typeof fileData}`);
      }
    }

    if (!data || data.length === 0) {
      throw new Error("Generated GIF file is empty");
    }

    const blob = new Blob([data.buffer as ArrayBuffer], {
      type: "image/gif",
    });

    if (blob.size === 0) {
      throw new Error("Created GIF blob is empty");
    }

    // 清理临时文件
    try {
      for (let i = 0; i < frames.length; i++) {
        await ffmpeg.deleteFile(`frame_${i.toString().padStart(4, "0")}.png`);
      }
      await ffmpeg.deleteFile(outputFile);
      await ffmpeg.deleteFile("palette.png");
    } catch (cleanupError) {
      console.warn("清理临时文件失败:", cleanupError);
    }

    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        if (!result || result.length === 0) {
          reject(new Error("FileReader result is empty"));
        } else {
          resolve(result);
        }
      };
      reader.onerror = () => {
        reject(new Error("Failed to read GIF"));
      };
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    // 清理临时文件
    try {
      for (let i = 0; i < frames.length; i++) {
        await ffmpeg.deleteFile(`frame_${i.toString().padStart(4, "0")}.png`);
      }
      await ffmpeg.deleteFile("output.gif");
      await ffmpeg.deleteFile("palette.png");
    } catch (cleanupError) {
      console.error("Cleanup error:", cleanupError);
    }
    throw error;
  }
}

