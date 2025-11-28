/**
 * 背景移除服务
 * 调用外部 API 移除图片背景
 */

export class BackgroundRemovalError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "BackgroundRemovalError";
  }
}

/**
 * 使用外部 API 移除图片背景
 * @param base64Image base64 图片数据（可以包含 data:image/xxx;base64, 前缀）
 * @param refineForeground 是否精炼边缘（更高质量，但更慢），默认为 false
 * @returns 移除背景后的 base64 图片（PNG 格式，透明背景）
 * @throws {BackgroundRemovalError} 当背景移除失败时抛出错误
 */
export const removeBackground = async (
  base64Image: string,
  refineForeground: boolean = false
): Promise<string> => {
  try {
    // 处理 base64 数据
    let imageData = base64Image;
    if (base64Image.includes(",")) {
      imageData = base64Image.split(",")[1];
    }

    // 将 base64 转换为 Blob
    const byteCharacters = atob(imageData);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);

    // 检测图片类型
    let mimeType = "image/png";
    if (
      base64Image.startsWith("data:image/jpeg") ||
      base64Image.startsWith("data:image/jpg")
    ) {
      mimeType = "image/jpeg";
    } else if (base64Image.startsWith("data:image/webp")) {
      mimeType = "image/webp";
    }

    const blob = new Blob([byteArray], { type: mimeType });

    // 创建 FormData
    const formData = new FormData();
    formData.append("image", blob, "image.png");
    formData.append("refine_foreground", refineForeground ? "true" : "false");

    // 调用 Next.js API 路由（代理到外部服务）
    const response = await fetch("/api/background-remove", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new BackgroundRemovalError(
        `Background removal API failed: ${response.status} ${response.statusText}. ${errorText}`
      );
    }

    // 获取返回的图片（可能是 Blob 或 base64）
    const contentType = response.headers.get("content-type");
    console.log("抠图接口返回的 Content-Type:", contentType);

    if (contentType && contentType.startsWith("image/")) {
      // 返回的是图片 Blob
      const blob = await response.blob();
      console.log("抠图接口返回的图片 Blob:", {
        size: blob.size,
        type: blob.type,
      });

      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const result = reader.result as string;
          console.log("抠图接口返回的 base64 图片:", {
            length: result.length,
            preview: result.substring(0, 150),
            isDataUrl: result.startsWith("data:image"),
          });
          resolve(result);
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    } else {
      // 可能是 JSON 格式的响应
      const result = await response.json();
      console.log("抠图接口返回的 JSON 数据:", result);

      if (result.image || result.data?.image) {
        const imageData = result.image || result.data.image;
        console.log("从 JSON 中提取的图片数据:", {
          type: typeof imageData,
          length: imageData?.length,
          preview: imageData?.substring(0, 150),
        });
        return imageData;
      }
      throw new BackgroundRemovalError(
        "Invalid response format from background removal API"
      );
    }
  } catch (error) {
    if (error instanceof BackgroundRemovalError) {
      throw error;
    }
    console.error("Remove background error:", error);
    throw new BackgroundRemovalError(
      error instanceof Error ? error.message : "Unknown error occurred"
    );
  }
};
