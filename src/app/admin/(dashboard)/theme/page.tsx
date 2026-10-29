import { getTheme } from "@/lib/content";
import { ThemeEditor } from "@/components/admin/ThemeEditor";

export default async function ThemeScreen() {
  return <ThemeEditor theme={await getTheme()} />;
}
