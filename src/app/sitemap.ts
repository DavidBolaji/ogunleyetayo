import type { MetadataRoute } from "next";
import { site } from "@/content/site";

const routes = [
  "",
  "/about",
  "/music",
  "/ministry",
  "/ministry/summit",
  "/teaching",
  "/books",
  "/journal",
  "/work-with-me",
  "/edwoltz",
  "/edwoltz/environment",
  "/contact",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return routes.map((route) => ({
    url: `${site.url}${route}`,
    lastModified,
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : 0.7,
  }));
}
