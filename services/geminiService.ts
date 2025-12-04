import { fetchWithTimeout } from "@/lib/request";
import {
  resizeImage,
  resizeImageForSticker,
  extractMimeType,
  cleanBase64,
  urlToBase64,
  isUrl,
  getProxiedUrl,
} from "@/lib/image-utils";
import {
  API_BASE_URL,
  REQUEST_TIMEOUT_MS,
  handleGeminiError,
  extractImageFromResponse,
} from "@/lib/gemini-utils";

// 类型定义
interface GenerationConfig {
  responseModalities: string[];
  imageConfig?: {
    aspectRatio?: string;
    outputFormat?: string;
  };
}

interface RequestPart {
  inlineData?: {
    data: string;
    mimeType: string;
  };
  text?: string;
}

/**
 * 处理图片输入（URL 转 base64，优化尺寸）
 */
async function processImageInput(
  imageInput: string,
  useHighResolution = false
): Promise<{
  cleanBase64: string;
  mimeType: string;
}> {
  // 如果输入是 URL，先转换为 base64
  let imageToProcess = imageInput;
  if (isUrl(imageInput)) {
    console.log("检测到 URL，转换为 base64:", imageInput);
    const proxiedUrl = getProxiedUrl(imageInput);
    imageToProcess = await urlToBase64(proxiedUrl);
  }

  // 优化图片尺寸（表情包使用更高分辨率）
  const optimizedImage = useHighResolution
    ? await resizeImageForSticker(imageToProcess)
    : await resizeImage(imageToProcess);
  const detectedMimeType = extractMimeType(optimizedImage);
  const cleanBase64Data = cleanBase64(optimizedImage);

  // 验证 base64 数据
  if (!cleanBase64Data || cleanBase64Data.length === 0) {
    throw new Error("Invalid base64 image data");
  }

  return {
    cleanBase64: cleanBase64Data,
    mimeType: detectedMimeType,
  };
}

/**
 * 构建生成配置
 */
function buildGenerationConfig(
  aspectRatio?: string,
  imageSize?: "1K" | "2K" | "4K",
  imageFormat?: "PNG" | "JPEG" | "WEBP"
): GenerationConfig {
  const config: GenerationConfig = {
    responseModalities: ["IMAGE"],
  };

  // 如果有图片配置参数，添加 imageConfig
  if (aspectRatio || imageFormat) {
    config.imageConfig = {};
    if (aspectRatio) {
      config.imageConfig.aspectRatio = aspectRatio;
    }
    if (imageFormat) {
      // outputFormat 需要小写
      config.imageConfig.outputFormat = imageFormat.toLowerCase();
    }
    // imageSize 暂时注释掉，因为可能导致 API 错误
  }

  return config;
}

/**
 * 构建请求 parts（图片 + 文本提示词）
 */
function buildRequestParts(
  cleanBase64: string,
  mimeType: string,
  prompts: string[]
): RequestPart[] {
  const parts: RequestPart[] = [
    {
      inlineData: {
        data: cleanBase64,
        mimeType,
      },
    },
  ];

  // 添加所有提示词作为独立的 text parts
  prompts.forEach((prompt) => {
    if (prompt?.trim()) {
      parts.push({
        text: prompt.trim(),
      });
    }
  });

  return parts;
}

/**
 * Generates a new image based on an input image and a text prompt using Gemini 2.5 Flash Image.
 * @param base64Image - 输入图片（base64 或 URL）
 * @param mimeType - 图片 MIME 类型（已废弃，自动检测）
 * @param prompt - 单个提示词字符串，或多个提示词数组
 * @param aspectRatio - 宽高比，例如 "16:9", "1:1"
 * @param imageSize - 图片尺寸（暂时未使用）
 * @param imageFormat - 输出格式
 */
export const generateExtendedScene = async (
  base64Image: string,
  mimeType: string, // 保留参数以保持向后兼容，但实际会自动检测
  prompt: string | string[],
  aspectRatio?: string,
  imageSize?: "1K" | "2K" | "4K",
  imageFormat?: "PNG" | "JPEG" | "WEBP"
): Promise<string> => {
  try {
    // 处理图片输入
    const { cleanBase64, mimeType: detectedMimeType } = await processImageInput(
      base64Image
    );

    // 构建生成配置
    const generationConfig = buildGenerationConfig(
      aspectRatio,
      imageSize,
      imageFormat
    );

    // 处理提示词（支持单个或多个）
    const prompts = Array.isArray(prompt) ? prompt : [prompt];

    // 为场景扩展添加保持原图背景的指令
    const backgroundInstruction = "Keep the original background from the image completely unchanged. Only extend the scene while preserving the exact background. ";
    const enhancedPrompts = prompts.map((p) => {
      if (p?.trim()) {
        return `${backgroundInstruction}${p.trim()}`;
      }
      return p;
    });

    // 日志记录
    console.log(`[Gemini Service] 生成场景扩展，提示词数量: ${enhancedPrompts.length}`);
    enhancedPrompts.forEach((p, idx) => {
      console.log(
        `[Gemini Service]  提示词 ${idx + 1}: ${p.substring(0, 100)}...`
      );
    });

    // 构建请求 parts
    const parts = buildRequestParts(cleanBase64, detectedMimeType, enhancedPrompts);

    console.log(
      `[Gemini Service] 构建的 parts 数量: ${parts.length} (1个图片 + ${
        parts.length - 1
      }个文本)`
    );

    // 发送请求
    const response = await fetchWithTimeout(
      API_BASE_URL,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [{ parts }],
          generationConfig,
        }),
      },
      REQUEST_TIMEOUT_MS
    );

    // 记录响应状态
    console.log(
      `[Gemini Service] Response status: ${response.status} ${response.statusText}, ok: ${response.ok}`
    );

    // 处理错误响应
    if (!response.ok) {
      console.error(
        `[Gemini Service] API returned error status: ${response.status} ${response.statusText}`
      );
      await handleGeminiError(response, generationConfig);
    }

    // 提取图片数据
    const data = await response.json();

    // 检查响应数据是否为空对象
    if (!data || (typeof data === "object" && Object.keys(data).length === 0)) {
      console.error("[Gemini Service] Response data is empty object");
      throw new Error("API returned empty response");
    }

    return extractImageFromResponse(data);
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};

/**
 * 计算 base64 数据大小（KB）
 */
function calculateBase64Size(base64: string): number {
  return (base64.length * 3) / 4 / 1024;
}

/**
 * 构建贴纸生成提示词
 */
function buildStickerPrompt(
  moodPrompt: string,
  removeBackground?: boolean
): string {
  const backgroundInstruction = removeBackground
    ? "Transparent background. "
    : "Keep the original background from the image. ";

  return `Create a high-quality, high-resolution die-cut sticker of the main character from this image. 
Style: Vector art, flat color, thick white outline around the character edges only. 
Quality: Ultra-high resolution, sharp details, crisp edges, professional quality.
${backgroundInstruction}
Expression/Action: ${moodPrompt}. `;
}

/**
 * Generates a meme/sticker version of the input image.
 */
export const generateSticker = async (
  base64Image: string,
  moodPrompt: string,
  options?: {
    backgroundType?: "transparent" | "white" | "color";
    backgroundColor?: string;
    removeBackground?: boolean;
    keepOriginal?: boolean; // 如果为 true，直接返回原图，不调用生成接口
  }
): Promise<string> => {
  // 如果要求保持原图，直接返回原图
  if (options?.keepOriginal) {
    console.log("保持原图模式，直接返回原图");
    return base64Image;
  }

  try {
    // 处理图片输入（表情包使用更高分辨率）
    const { cleanBase64, mimeType: detectedMimeType } = await processImageInput(
      base64Image,
      true // 使用高分辨率处理
    );

    // 记录图片信息
    console.log("生成接口接收的图片参数:", {
      mimeType: detectedMimeType,
      length: base64Image.length,
      preview: base64Image.substring(0, 150),
    });

    // 检查 base64 数据大小
    const base64SizeKB = calculateBase64Size(cleanBase64);
    console.log("Base64 图片数据大小:", {
      sizeKB: base64SizeKB.toFixed(2),
      sizeMB: (base64SizeKB / 1024).toFixed(2),
      length: cleanBase64.length,
    });

    // 如果图片太大，警告
    if (base64SizeKB > 4000) {
      console.warn("图片数据较大，可能会超过 API 限制");
    }

    // 构建提示词和配置
    const fullPrompt = buildStickerPrompt(
      moodPrompt,
      options?.removeBackground
    );
    const generationConfig: GenerationConfig = {
      responseModalities: ["IMAGE"],
      // 暂时移除 imageConfig，因为 outputFormat 参数不被 API 支持
      // 透明背景和高质量通过提示词来保证
    };

    // 构建请求
    const requestBody = {
      contents: [
        {
          parts: [
            {
              inlineData: {
                data: cleanBase64,
                mimeType: detectedMimeType,
              },
            },
            {
              text: fullPrompt,
            },
          ],
        },
      ],
      generationConfig,
    };

    console.log("发送到 Gemini API 的请求信息:", {
      mimeType: detectedMimeType,
      base64Length: cleanBase64.length,
      base64SizeKB: base64SizeKB.toFixed(2),
      promptLength: fullPrompt.length,
      hasImageConfig: !!generationConfig.imageConfig,
    });

    // 发送请求
    const response = await fetchWithTimeout(
      API_BASE_URL,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      },
      REQUEST_TIMEOUT_MS
    );

    // 处理错误响应
    if (!response.ok) {
      await handleGeminiError(response, generationConfig);
    }

    // 提取图片数据
    const data = await response.json();
    return extractImageFromResponse(data);
  } catch (error) {
    console.error("Sticker Generation Error:", error);
    throw error;
  }
};
