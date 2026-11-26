import { installFetchHook } from '@/utils/fetch-hook';
import { installXhrHook } from '@/utils/xhr-hook';
import { installWebSocketHook } from '@/utils/websocket-hook';

export default defineUnlistedScript(() => {
  const page = window as typeof window & { __netRecorderHooked?: boolean };
  if (page.__netRecorderHooked) return;
  page.__netRecorderHooked = true;

  installFetchHook();
  installXhrHook();
  installWebSocketHook();
});
