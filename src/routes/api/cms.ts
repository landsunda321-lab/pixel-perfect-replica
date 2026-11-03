import { createFileRoute } from "@tanstack/react-router";
import { handleCmsRequest } from "@/server/cms.server";

export const Route = createFileRoute("/api/cms")({
  server: {
    handlers: {
      GET: ({ request }) => handleCmsRequest(request),
      POST: ({ request }) => handleCmsRequest(request),
      PATCH: ({ request }) => handleCmsRequest(request),
      DELETE: ({ request }) => handleCmsRequest(request),
    },
  },
});
