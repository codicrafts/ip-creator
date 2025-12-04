import { getProxiedImageUrl } from "@/lib/image-storage";

/**
 * 创建包含文字的最终效果图
 */
export async function createFinalImageWithText(
  imageUrl: string,
  text: string,
  autoUpload: boolean = false,
  textPosition: "top" | "bottom" = "bottom"
): Promise<string> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      reject(new Error("无法创建 canvas context"));
      return;
    }

    canvas.width = 240;
    canvas.height = 240;

    const img = new Image();
    img.crossOrigin = "anonymous";
    
    const imageSrc = imageUrl.startsWith("data:image")
      ? imageUrl
      : getProxiedImageUrl(imageUrl);
    
    img.src = imageSrc;

    img.onload = async () => {
      try {
        if (img.width === 0 || img.height === 0) {
          reject(new Error("图片尺寸无效"));
          return;
        }

        ctx.clearRect(0, 0, 240, 240);

        const scale = Math.min(240 / img.width, 240 / img.height);
        const w = img.width * scale;
        const h = img.height * scale;
        const x = (240 - w) / 2;
        const y = (240 - h) / 2;
        
        try {
          ctx.drawImage(img, x, y, w, h);
        } catch (drawError) {
          console.error("Canvas drawImage error:", drawError);
          reject(new Error("图片绘制失败"));
          return;
        }

        if (text) {
          ctx.font = "bold 24px sans-serif";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillStyle = "white";
          ctx.strokeStyle = "black";
          ctx.lineWidth = 4;

          // 根据文字位置设置 Y 坐标
          const textY = textPosition === "top" ? 30 : 240 - 30;
          ctx.strokeText(text, 120, textY);
          ctx.fillText(text, 120, textY);
        }

        canvas.toBlob(
          async (blob) => {
            if (!blob) {
              reject(new Error("无法创建图片 Blob"));
              return;
            }

            const reader = new FileReader();
            reader.onloadend = () => {
              const result = reader.result as string;
              if (!result || !result.startsWith("data:image")) {
                reject(new Error("图片数据转换失败"));
                return;
              }
              resolve(result);
            };
            reader.onerror = () => {
              reject(new Error("图片读取失败"));
            };
            reader.readAsDataURL(blob);
          },
          "image/png",
          1.0
        );
      } catch (error) {
        reject(error);
      }
    };

    img.onerror = (error) => {
      console.error("Image load error:", {
        src: imageSrc.substring(0, 100),
        isBase64: imageUrl.startsWith("data:image"),
        error: error,
      });
      reject(new Error(`图片加载失败: ${imageSrc.substring(0, 50)}...`));
    };
  });
}


