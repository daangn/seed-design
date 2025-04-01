const DEFAULT_SETTINGS_KEY = "settings";
/**
 * @see https://github.com/yuanqing/create-figma-plugin/blob/e55610afdc4d6b411befeab0aea575d116d48324/packages/utilities/src/settings.ts#L11
 */
export async function loadSettingsAsync<Settings>(
  defaultSettings: Settings,
  settingsKey = DEFAULT_SETTINGS_KEY,
): Promise<Settings> {
  const settings: Settings = await figma.clientStorage.getAsync(settingsKey);
  if (typeof settings === "undefined") {
    return defaultSettings;
  }
  return Object.assign({}, defaultSettings, settings);
}
