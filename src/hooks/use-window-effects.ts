import { useEffect, useCallback, useRef } from "react";
import { getCurrentWindow } from "@tauri-apps/api/window";
import { getCurrentWebviewWindow } from "@tauri-apps/api/webviewWindow";
import { toast } from "sonner";
import { useCatStore } from "@/stores/cat-store";

export function useWindowEffects() {
  const { penetrable, alwaysOnTop, visible, opacity } = useCatStore();

  const windowRef = useRef<ReturnType<typeof getCurrentWebviewWindow> | null>(null);
  const isInitializedRef = useRef(false);

  const debug = useCallback((label: string, extra?: Record<string, unknown>) => {
    const msg = `[window-effects] ${label} ${extra ? JSON.stringify(extra) : ""}`;
    console.log(msg);
    toast(msg);
  }, []);

  const getWindow = useCallback(() => {
    windowRef.current ??= getCurrentWebviewWindow();
    return windowRef.current;
  }, []);

  const reapplyWindowFlags = useCallback(async () => {
    try {
      debug("reapplyWindowFlags:start", { penetrable, alwaysOnTop });

      const window = getWindow();
      await window.setIgnoreCursorEvents(penetrable);
      await window.setAlwaysOnTop(alwaysOnTop);

      debug("reapplyWindowFlags:done", { penetrable, alwaysOnTop });
    } catch (error) {
      toast.error(`Failed to reapply window flags: ${String(error)}`);
    }
  }, [getWindow, penetrable, alwaysOnTop, debug]);

  useEffect(() => {
    let unlisten: null | (() => void) = null;

    const setup = async () => {
      try {
        debug("focus-listener:setup");

        unlisten = await getCurrentWindow().onFocusChanged((event) => {
          debug("focusChanged", { focused: event.payload, penetrable, alwaysOnTop, visible });

          if (event.payload) {
            void reapplyWindowFlags();
          }
        });
      } catch (error) {
        toast.error(`Failed to listen focus changes: ${String(error)}`);
      }
    };

    void setup();

    return () => {
      try {
        debug("focus-listener:cleanup");
        unlisten?.();
      } catch {
        // ignore
      }
    };
  }, [reapplyWindowFlags, debug, penetrable, alwaysOnTop, visible]);

  useEffect(() => {
    if (!isInitializedRef.current) {
      isInitializedRef.current = true;

      const initAlwaysOnTop = async () => {
        try {
          debug("initAlwaysOnTop:start", { alwaysOnTop });

          const window = getWindow();
          await window.setAlwaysOnTop(alwaysOnTop);

          debug("initAlwaysOnTop:done", { alwaysOnTop });
        } catch (error) {
          toast.error(`Failed to set window always on top: ${String(error)}`);
        }
      };

      void initAlwaysOnTop();
    }
  }, [alwaysOnTop, getWindow, debug]);

  useEffect(() => {
    const applyPenetrable = async () => {
      try {
        debug("applyPenetrable:start", { penetrable });

        const window = getWindow();
        await window.setIgnoreCursorEvents(penetrable);

        debug("applyPenetrable:done", { penetrable });
      } catch (error) {
        toast.error(`Failed to set window click-through: ${String(error)}`);
      }
    };

    void applyPenetrable();
  }, [penetrable, getWindow, debug]);

  useEffect(() => {
    if (!isInitializedRef.current) return;

    const applyAlwaysOnTop = async () => {
      try {
        debug("applyAlwaysOnTop:start", { alwaysOnTop });

        const window = getWindow();
        await window.setAlwaysOnTop(alwaysOnTop);

        debug("applyAlwaysOnTop:done", { alwaysOnTop });
      } catch (error) {
        toast.error(`Failed to update window always on top: ${String(error)}`);
      }
    };

    void applyAlwaysOnTop();
  }, [alwaysOnTop, getWindow, debug]);

  useEffect(() => {
    const applyVisibility = async () => {
      try {
        debug("applyVisibility:start", { visible, penetrable, alwaysOnTop });

        const window = getWindow();
        if (visible) {
          await window.show();
          await window.setFocus();
          await reapplyWindowFlags();
        } else {
          await window.hide();
        }

        debug("applyVisibility:done", { visible });
      } catch (error) {
        toast.error(`Failed to set window visibility: ${String(error)}`);
      }
    };

    void applyVisibility();
  }, [visible, getWindow, reapplyWindowFlags, debug, penetrable, alwaysOnTop]);

  useEffect(() => {
    document.documentElement.style.setProperty("--window-opacity", (opacity / 100).toString());
  }, [opacity]);
}
