export function getStreamingVideoUrl(url: string): string {
  if (!url || !url.includes("res.cloudinary.com") || !url.includes("/upload/")) return url;
  return url.includes("/upload/q_auto:good,f_auto/") ? url : url.replace("/upload/", "/upload/q_auto:good,f_auto/");
}
