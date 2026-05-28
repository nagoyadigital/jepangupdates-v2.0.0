import { prisma } from "@/lib/prisma";

export type WidgetSettings = {
  enabled: boolean;
  position: string;
  settings: Record<string, string>;
};

export type WidgetConfigMap = Record<string, WidgetSettings>;

// Default widget configs (fallback when no DB settings exist)
const defaults: WidgetConfigMap = {
  prayer_times: { enabled: true, position: "sidebar_top", settings: { city: "Tokyo", method: "3" } },
  weather: { enabled: true, position: "sidebar_top", settings: { city: "Tokyo", units: "metric" } },
  breaking_news: { enabled: true, position: "header_bottom", settings: { max_items: "5", scroll_speed: "normal" } },
  trending: { enabled: true, position: "sidebar_middle", settings: { max_items: "10", period: "7days" } },
  events: { enabled: true, position: "sidebar_bottom", settings: { max_items: "3" } },
  japan_carousel: { enabled: true, position: "home_middle", settings: { auto_play: "true", interval: "5000" } },
};

/**
 * Server-side: get all widget configurations from database.
 * Falls back to defaults if no settings found.
 */
export async function getWidgetConfig(): Promise<WidgetConfigMap> {
  try {
    const settings = await prisma.siteSetting.findMany({
      where: { group: "widgets" },
    });

    if (settings.length === 0) return defaults;

    const config: WidgetConfigMap = { ...defaults };

    for (const setting of settings) {
      try {
        const parsed = JSON.parse(setting.value) as WidgetSettings;
        config[setting.key] = {
          enabled: parsed.enabled ?? true,
          position: parsed.position ?? defaults[setting.key]?.position ?? "sidebar_top",
          settings: parsed.settings ?? defaults[setting.key]?.settings ?? {},
        };
      } catch {
        // Skip invalid JSON
      }
    }

    return config;
  } catch {
    return defaults;
  }
}

/**
 * Check if a specific widget is enabled.
 */
export function isWidgetEnabled(config: WidgetConfigMap, key: string): boolean {
  return config[key]?.enabled ?? false;
}

/**
 * Get widgets for a specific position.
 */
export function getWidgetsForPosition(config: WidgetConfigMap, position: string): string[] {
  return Object.entries(config)
    .filter(([, v]) => v.enabled && v.position === position)
    .map(([k]) => k);
}
