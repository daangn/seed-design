export function generateCommandId(): string {
  return `cmd_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
}
