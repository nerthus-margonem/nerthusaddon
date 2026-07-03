export function addWidget(
  widgetContainer: HTMLDivElement,
  name: string,
  imageUrl?: string,
  description?: string,
): HTMLDivElement {
  const widget = document.createElement("div");
  widget.id = `${name}-widget`;
  widget.className = "nerthus__widget";

  const image = document.createElement("div");
  image.className = "nerthus__widget-image";
  if (imageUrl) {
    image.style.backgroundImage = `url(${imageUrl})`;
  }

  const desc = document.createElement("div");
  desc.className = "nerthus__widget-desc";
  if (description) {
    desc.textContent = description;
  }

  widget.append(image, desc);
  widgetContainer.append(widget);

  return widget;
}

export function initWidgets(): HTMLDivElement {
  let parentElement: Element | null;
  if (INTERFACE === "NI") {
    parentElement = document.querySelector(".layer.interface-layer");
  } else {
    parentElement = document.getElementById("centerbox2");
  }

  const widgetsContainer = document.createElement("div");
  widgetsContainer.id = "nerthus-widgets-container";

  if (!parentElement) {
    console.error(
      "No interface element was found to attach the widgets container",
    );
    // Return the detached widget container
    // to not break the rest of the app in case of failure,
    // as the widget container is supposed to always exist
    return widgetsContainer;
  }

  parentElement.append(widgetsContainer);
  return widgetsContainer;
}
