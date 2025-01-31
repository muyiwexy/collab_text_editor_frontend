import { createClient } from "@liveblocks/client";

export const liveblocksClient = createClient({
  publicApiKey: process.env.PUBLIC_LIVE_BLOCKS_SECRET_KEY!,
});
