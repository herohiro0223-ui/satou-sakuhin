const MAX_SIZE = 1200;
const TARGET_BYTES = 300 * 1024; // 300KB目標

export function compressImage(dataUrl: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      let { width, height } = img;

      // リサイズ（長辺1200px以内）
      if (width > MAX_SIZE || height > MAX_SIZE) {
        if (width > height) {
          height = Math.round((height * MAX_SIZE) / width);
          width = MAX_SIZE;
        } else {
          width = Math.round((width * MAX_SIZE) / height);
          height = MAX_SIZE;
        }
      }

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("Canvas not supported"));
        return;
      }
      ctx.drawImage(img, 0, 0, width, height);

      // 高品質から試して、目標サイズ以下になるまで下げる
      let quality = 0.92;
      let result = canvas.toDataURL("image/jpeg", quality);

      while (result.length > TARGET_BYTES * 1.37 && quality > 0.3) {
        // base64は元の約1.37倍
        quality -= 0.05;
        result = canvas.toDataURL("image/jpeg", quality);
      }

      resolve(result);
    };
    img.onerror = () => reject(new Error("Image load failed"));
    img.src = dataUrl;
  });
}
