export const copy = (text: string) => {
  try {
    navigator.clipboard.writeText(text);
  } catch (_) {
    const input = document.createElement("input");
    input.style.position = "fixed";
    input.style.top = "0";
    input.style.left = "0";
    input.style.opacity = "0";
    document.body.appendChild(input);
    input.value = text;
    input.focus();
    input.select();
    const result = document.execCommand("copy");
    document.body.removeChild(input);
    if (!result) {
      console.error("copy failed");
    }
  }
};
