export const notify = (message: string) => {
  figma.notify(message, { timeout: 2000 });
};
