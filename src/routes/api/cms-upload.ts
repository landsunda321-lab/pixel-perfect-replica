import { createFileRoute } from "@tanstack/react-router";
import { handleCmsImageUpload } from "@/server/cms.server";

export const Route = createFileRoute("/api/cms-upload")({
  server: { handlers: { POST: ({ request }) => handleCmsImageUpload(request) } },
});
