// 使用 Next.js API 路由代理 Gemini API 调用（服务端）
const API_BASE_URL = "/api/gemini/generate";

/**
 * Resize image if it exceeds max dimensions to prevent API errors.
 */
const resizeImage = async (
  base64Str: string,
  maxWidth = 1024,
  maxHeight = 1024
): Promise<string> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = base64Str;
    img.onload = () => {
      let width = img.width;
      let height = img.height;

      if (width <= maxWidth && height <= maxHeight) {
        resolve(base64Str);
        return;
      }

      if (width > height) {
        if (width > maxWidth) {
          height = Math.round((height *= maxWidth / width));
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width = Math.round((width *= maxHeight / height));
          height = maxHeight;
        }
      }

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      ctx?.drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL("image/jpeg", 0.9)); // Use JPEG 0.9 for reasonable quality/size
    };
    img.onerror = () => resolve(base64Str); // Fallback
  });
};

/**
 * Generates a new image based on an input image and a text prompt using Gemini 2.5 Flash Image.
 * @param prompts - 单个提示词字符串，或多个提示词数组。如果传入数组，每个提示词将作为独立的 text part
 */
export const generateExtendedScene = async (
  base64Image: string,
  mimeType: string,
  prompt: string | string[],
  aspectRatio?: string,
  imageSize?: "1K" | "2K" | "4K",
  imageFormat?: "PNG" | "JPEG" | "WEBP"
): Promise<string> => {
  try {
    // Optimize image size before sending
    const optimizedImage = await resizeImage(base64Image);

    // 提取 mimeType（保留原始格式信息）
    let detectedMimeType = "image/jpeg";
    if (base64Image.startsWith("data:image/png")) {
      detectedMimeType = "image/png";
    } else if (base64Image.startsWith("data:image/webp")) {
      detectedMimeType = "image/webp";
    } else if (
      base64Image.startsWith("data:image/jpeg") ||
      base64Image.startsWith("data:image/jpg")
    ) {
      detectedMimeType = "image/jpeg";
    }

    const cleanBase64 = optimizedImage.replace(
      /^data:image\/(png|jpeg|jpg|webp);base64,/,
      ""
    );

    // 验证 base64 数据
    if (!cleanBase64 || cleanBase64.length === 0) {
      throw new Error("Invalid base64 image data");
    }

    const generationConfig: any = {
      responseModalities: ["IMAGE"],
    };

    // Add imageConfig if aspectRatio, imageSize, or imageFormat is provided
    if (aspectRatio || imageSize || imageFormat) {
      generationConfig.imageConfig = {};
      if (aspectRatio) {
        // aspectRatio 格式：例如 "16:9", "1:1" 等
        generationConfig.imageConfig.aspectRatio = aspectRatio;
      }
      // 暂时注释掉 imageSize 的设置
      // if (imageSize) {
      //   // imageSize 格式：可能是 "1K", "2K", "4K" 或其他格式
      //   generationConfig.imageConfig.imageSize = imageSize;
      // }
      if (imageFormat) {
        // outputFormat 需要小写：例如 "png", "jpeg", "webp"
        generationConfig.imageConfig.outputFormat = imageFormat.toLowerCase();
      }
    }

    // 支持多个提示词，每个提示词作为独立的 text part
    const prompts = Array.isArray(prompt) ? prompt : [prompt];
    
    console.log(`[Gemini Service] 生成场景扩展，提示词数量: ${prompts.length}`);
    prompts.forEach((p, idx) => {
      console.log(`[Gemini Service]  提示词 ${idx + 1}: ${p.substring(0, 100)}...`);
    });
    
    // 构建 parts：先添加图片，然后添加所有文本提示词
    const parts: any[] = [
      {
        inlineData: {
          data: cleanBase64,
          mimeType: detectedMimeType,
        },
      },
    ];
    
    // 添加所有提示词作为独立的 text parts
    prompts.forEach((p) => {
      if (p && p.trim()) {
        parts.push({
          text: p.trim(),
        });
      }
    });

    console.log(`[Gemini Service] 构建的 parts 数量: ${parts.length} (1个图片 + ${parts.length - 1}个文本)`);

    const requestBody = {
      contents: [
        {
          parts,
        },
      ],
      generationConfig,
    };

    const response = await fetch(API_BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      let errorMessage = `API request failed: ${response.status} ${response.statusText}`;
      try {
        const errorData = await response.json();
        console.error("Gemini API Error:", errorData);
        console.error(
          "Request generationConfig:",
          JSON.stringify(generationConfig, null, 2)
        );

        // 提取详细的错误信息
        if (errorData.error) {
          const error = errorData.error;
          errorMessage =
            error.message ||
            error.localized_message ||
            JSON.stringify(error) ||
            errorMessage;
        } else {
          errorMessage = JSON.stringify(errorData) || errorMessage;
        }
      } catch (e) {
        const errorText = await response.text();
        console.error("Gemini API Error (text):", errorText);
        errorMessage = errorText || errorMessage;
      }
      throw new Error(errorMessage);
    }

    const data = await response.json();
    const responseParts = data.candidates?.[0]?.content?.parts;
    if (!responseParts) {
      throw new Error("No content generated");
    }

    for (const part of responseParts) {
      if (part.inlineData && part.inlineData.data) {
        const outputMimeType = part.inlineData.mimeType || "image/png";
        return `data:${outputMimeType};base64,${part.inlineData.data}`;
      }
    }

    throw new Error("No image data found in the response");
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};

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
  }
): Promise<string> => {
  try {
    // 检测图片的 MIME 类型（抠图接口返回的应该是 PNG）
    let detectedMimeType = "image/png";
    if (base64Image.startsWith("data:image/png")) {
      detectedMimeType = "image/png";
    } else if (
      base64Image.startsWith("data:image/jpeg") ||
      base64Image.startsWith("data:image/jpg")
    ) {
      detectedMimeType = "image/jpeg";
    } else if (base64Image.startsWith("data:image/webp")) {
      detectedMimeType = "image/webp";
    }

    console.log("生成接口接收的图片参数:", {
      mimeType: detectedMimeType,
      length: base64Image.length,
      preview: base64Image.substring(0, 150),
    });

    // Optimize image size before sending
    const optimizedImage = await resizeImage(base64Image);
    const cleanBase64 = optimizedImage.replace(
      /^data:image\/(png|jpeg|webp);base64,/,
      ""
    );

    // 验证 base64 数据
    if (!cleanBase64 || cleanBase64.length === 0) {
      throw new Error("Invalid base64 image data");
    }

    // 检查 base64 数据大小（Gemini API 可能有大小限制）
    const base64SizeKB = (cleanBase64.length * 3) / 4 / 1024;
    console.log("Base64 图片数据大小:", {
      sizeKB: base64SizeKB.toFixed(2),
      sizeMB: (base64SizeKB / 1024).toFixed(2),
      length: cleanBase64.length,
    });

    // 如果图片太大，可能需要进一步压缩
    if (base64SizeKB > 4000) {
      console.warn("图片数据较大，可能会超过 API 限制");
    }

    // 提示词：生成透明背景的表情包
    const fullPrompt = `Create a high-quality die-cut sticker of the main character from this image. 
    Style: Vector art, flat color, thick white outline around the character edges only. 
    Expression/Action: ${moodPrompt}. 
    
    IMPORTANT: The output must have a completely transparent background.
    Do NOT add any background color, pattern, or texture.
    Only the character itself should be visible with a transparent background.
    Do not add any text inside the image.`;

    const generationConfig: any = {
      responseModalities: ["IMAGE"],
      // 暂时移除 imageConfig，因为可能导致 400 错误
      // 透明背景通过提示词来保证
      // imageConfig: {
      //   outputFormat: "png",
      // },
    };

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

    const response = await fetch(API_BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      let errorMessage: string;
      try {
        const errorData = await response.json();
        console.error("Gemini API Error:", errorData);
        console.error(
          "Request generationConfig:",
          JSON.stringify(generationConfig, null, 2)
        );
        console.error("Request body:", JSON.stringify(requestBody, null, 2));

        // 尝试提取更详细的错误信息
        if (errorData.error) {
          errorMessage =
            errorData.error.message ||
            errorData.error.localized_message ||
            JSON.stringify(errorData.error);
        } else if (errorData.details) {
          errorMessage = errorData.details;
        } else if (Object.keys(errorData).length > 0) {
          errorMessage = JSON.stringify(errorData);
        } else {
          errorMessage = `API request failed: ${response.status} ${response.statusText}`;
        }
      } catch {
        const errorText = await response.text();
        console.error("Gemini API Error (text):", errorText);
        errorMessage =
          errorText ||
          `API request failed: ${response.status} ${response.statusText}`;
      }
      throw new Error(errorMessage);
    }

    const data = await response.json();
    const parts = data.candidates?.[0]?.content?.parts;
    if (!parts) throw new Error("No content generated");

    for (const part of parts) {
      if (part.inlineData && part.inlineData.data) {
        const outputMimeType = part.inlineData.mimeType || "image/png";
        return `data:${outputMimeType};base64,${part.inlineData.data}`;
      }
    }
    throw new Error("No image data found");
  } catch (error) {
    console.error("Sticker Generation Error:", error);
    throw error;
  }
};
