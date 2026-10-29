import { getSettings } from "@/lib/content";
import { adminReference } from "@/lib/admin/reference";
import { SettingsEditor } from "@/components/admin/SettingsEditor";

export default async function SettingsScreen() {
  const [settings, reference] = await Promise.all([getSettings(), adminReference()]);

  return <SettingsEditor settings={settings} reference={reference} />;
}
