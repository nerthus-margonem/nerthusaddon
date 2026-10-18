export async function decodeImage(
  url: string,
): Promise<CanvasImageSource | undefined> {
  if (typeof ImageDecoder !== "undefined") {
    try {
      const image = await decodeImageWithImageDecoder(url);
      if (image) {
        return image;
      }
    } catch {
      // Go to fallback
    }
  }

  // fallback when ImageDecoder is not available or it fails
  const image = new Image();
  image.src = url;
  try {
    await image.decode();
  } catch (e) {
    console.warn(e);
    return undefined;
  }
  return image;
}

async function decodeImageWithImageDecoder(
  url: string,
): Promise<CanvasImageSource | undefined> {
  const response = await fetch(url);
  if (!response.ok || !response.body) {
    await response.body?.cancel();
    return undefined;
  }
  const type = response.headers.get("Content-Type") ?? "";
  const supported = await ImageDecoder.isTypeSupported(type).catch(() => false);
  if (!supported) {
    await response.body?.cancel();
    return undefined;
  }

  const decoder = new ImageDecoder({ data: response.body, type });
  // `completed` and `tracks.ready` reject independently of decode()
  // Silence them to avoid unhandled rejections.
  decoder.completed.catch(() => {});
  decoder.tracks.ready.catch(() => {});
  try {
    const { image } = await decoder.decode();
    try {
      return await createImageBitmap(image);
    } finally {
      image.close();
    }
  } finally {
    decoder.close();
  }
}
