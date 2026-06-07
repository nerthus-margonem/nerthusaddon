const styles = new Map<string, string>();
const styleElement = document.createElement("style");
styleElement.id = "nerthus-additional-styles";

export function addBasicStyles(): void {
  const stylesheet = document.createElement("link");
  stylesheet.rel = "stylesheet";
  stylesheet.href = FILE_PREFIX + "res/css/style.css";
  document.head.append(stylesheet);
}

export function addCustomStyle(styleName: string, styleContent: string): void {
  if (styles.has(styleName)) {
    return;
  }
  styleElement.textContent += styleContent;
  styles.set(styleName, styleContent);
}

export function changeCustomStyle(
  styleName: string,
  styleContent: string,
): void {
  if (styles.has(styleName)) {
    removeCustomStyle(styleName);
  }
  addCustomStyle(styleName, styleContent);
}

export function removeCustomStyle(styleName: string): void {
  const styleContent = styles.get(styleName);
  if (!styleContent) {
    return;
  }

  styleElement.textContent = styleElement.textContent
    .split(styleContent)
    .join("");

  styles.delete(styleName);
}

export function toggleCustomStyle(
  styleName: string,
  styleContent: string,
): void {
  if (styles.has(styleName)) {
    removeCustomStyle(styleName);
  } else {
    addCustomStyle(styleName, styleContent);
  }
}

export function initCssManager(): void {
  document.head.append(styleElement);
}
