import { getNavigation, getPages } from "@/lib/content";
import { NavigationEditor } from "@/components/admin/NavigationEditor";

export default async function NavigationScreen() {
  const [navigation, pages] = await Promise.all([getNavigation(), getPages()]);

  return (
    <NavigationEditor
      navigation={navigation}
      pages={pages.map(({ id, slug, title, status }) => ({ id, slug, title, status }))}
    />
  );
}
