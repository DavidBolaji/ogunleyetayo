import type { MetadataRoute } from "next";
import { posts } from "@/content/posts";
import { site } from "@/content/site";

const routes = [
  "",
  "/about",
  "/music",
  "/ministry",
  "/ministry/summit",
  "/teaching",
  "/books",
  "/blog",
  "/work-with-me",
  "/edwoltz",
  "/edwoltz/environment",
  "/contact",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  const all = [...routes, ...posts.map((post) => `/blog/${post.slug}`)];

  return all.map((route) => ({
    url: `${site.url}${route}`,
    lastModified,
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : 0.7,
  }));
}
