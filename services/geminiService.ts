// Nano Banana API endpoint
const API_BASE_URL =
  "https://api.laozhang.ai/v1beta/models/gemini-2.5-flash-image:generateContent";
const API_KEY = process.env.API_KEY || process.env.GEMINI_API_KEY;

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
 */
export const generateExtendedScene = async (
  base64Image: string,
  mimeType: string,
  prompt: string,
  aspectRatio?: string,
  imageSize?: "1K" | "2K" | "4K",
  imageFormat?: "PNG" | "JPEG" | "WEBP"
): Promise<string> => {
  try {
    if (!API_KEY) {
      throw new Error("API_KEY is not set");
    }

    // Optimize image size before sending
    const optimizedImage = await resizeImage(base64Image);
    const cleanBase64 = optimizedImage.replace(
      /^data:image\/(png|jpeg|webp);base64,/,
      ""
    );

    const generationConfig: any = {
      responseModalities: ["IMAGE"],
    };

    // Add imageConfig if aspectRatio, imageSize, or imageFormat is provided
    if (aspectRatio || imageSize || imageFormat) {
      generationConfig.imageConfig = {};
      if (aspectRatio) {
        generationConfig.imageConfig.aspectRatio = aspectRatio;
      }
      if (imageSize) {
        generationConfig.imageConfig.imageSize = imageSize;
      }
      if (imageFormat) {
        generationConfig.imageConfig.outputFormat = imageFormat;
      }
    }

    const requestBody = {
      contents: [
        {
          parts: [
            {
              inlineData: {
                data: cleanBase64,
                mimeType: "image/jpeg", // optimized is always jpeg/png
              },
            },
            {
              text: prompt,
            },
          ],
        },
      ],
      generationConfig,
    };

    const response = await fetch(API_BASE_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `API request failed: ${response.status} ${response.statusText} - ${errorText}`
      );
    }

    const data = await response.json();
    const parts = data.candidates?.[0]?.content?.parts;
    if (!parts) {
      throw new Error("No content generated");
    }

    for (const part of parts) {
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
  moodPrompt: string
): Promise<string> => {
  try {
    if (!API_KEY) {
      throw new Error("API_KEY is not set");
    }

    // Optimize image size before sending
    const optimizedImage = await resizeImage(base64Image);
    const cleanBase64 = optimizedImage.replace(
      /^data:image\/(png|jpeg|webp);base64,/,
      ""
    );

    const fullPrompt = `Turn the main character in this image into a high-quality die-cut sticker. 
    Style: Vector art, flat color, thick white outline, white background. 
    Expression/Action: ${moodPrompt}. 
    Ensure the character is isolated on a pure white background. 
    Do not add text inside the image.`;

    const requestBody = {
      contents: [
        {
          parts: [
            {
              inlineData: {
                data: cleanBase64,
                mimeType: "image/jpeg",
              },
            },
            {
              text: fullPrompt,
            },
          ],
        },
      ],
      generationConfig: {
        responseModalities: ["IMAGE"],
      },
    };

    const response = await fetch(API_BASE_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `API request failed: ${response.status} ${response.statusText} - ${errorText}`
      );
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
