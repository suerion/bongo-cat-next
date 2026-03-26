import { useEffect, useCallback, useRef } from "react";
import { getCurrentWindow } from "@tauri-apps/api/window";
import { getCurrentWebviewWindow } from "@tauri-apps/api/webviewWindow";
import { toast } from "sonner";
import { useCatStore } from "@/stores/cat-store";

/**
 * Window effects management hook.
 *
 * Responsibilities:
 * - Observe window-related state changes
 * - Apply Tauri window settings
 * - Handle click-through and always-on-top behavior
 * - Reapply important flags after focus changes
 */
export function useWindowEffects() {
  const { penetrable, alwaysOnTop, visible, opacity } = useCatStore();

  const windowRef = useRef<ReturnType<typeof getCurrentWebviewWindow> | null>(null);
  const isInitializedRef = useRef(false);

  const getWindow = useCallback(() => {
    windowRef.current ??= getCurrentWebviewWindow();
    return windowRef.current;
  }, []);

  const reapplyWindowFlags = useCallback(async () => {
    try {
      const window = getWindow();
      await window.setIgnoreCursorEvents(penetrable);
      await window.setAlwaysOnTop(alwaysOnTop);
    } catch (error) {
      toast.error(`Failed to reapply window flags: ${String(error)}`);
    }
  }, [getWindow, penetrable, alwaysOnTop]);

  useEffect(() => {
    let unlisten: null | (() => void) = null;

    const setup = async () => {
      try {
        unlisten = await getCurrentWindow().onFocusChanged((event) => {
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
        unlisten?.();
      } catch {
        // ignore
      }
    };
  }, [reapplyWindowFlags]);

  useEffect(() => {
    if (!isInitializedRef.current) {
      isInitializedRef.current = true;

      const initAlwaysOnTop = async () => {
        try {
          const window = getWindow();
          await window.setAlwaysOnTop(alwaysOnTop);
        } catch (error) {
          toast.error(`Failed to set window always on top: ${String(error)}`);
        }
      };

      void initAlwaysOnTop();
    }
  }, [alwaysOnTop, getWindow]);

  useEffect(() => {
    const applyPenetrable = async () => {
      try {
        const window = getWindow();
        await window.setIgnoreCursorEvents(penetrable);
      } catch (error) {
        toast.error(`Failed to set window click-through: ${String(error)}`);
      }
    };

    void applyPenetrable();
  }, [penetrable, getWindow]);

  useEffect(() => {
    if (!isInitializedRef.current) return;

    const applyAlwaysOnTop = async () => {
      try {
        const window = getWindow();
        await window.setAlwaysOnTop(alwaysOnTop);
      } catch (error) {
        toast.error(`Failed to update window always on top: ${String(error)}`);
      }
    };

    void applyAlwaysOnTop();
  }, [alwaysOnTop, getWindow]);

  useEffect(() => {
    const applyVisibility = async () => {
      try {
        const window = getWindow();
        if (visible) {
          await window.show();
          await window.setFocus();
          await reapplyWindowFlags();
        } else {
          await window.hide();
        }
      } catch (error) {
        toast.error(`Failed to set window visibility: ${String(error)}`);
      }
    };

    void applyVisibility();
  }, [visible, getWindow, reapplyWindowFlags]);

  useEffect(() => {
    document.documentElement.style.setProperty("--window-opacity", (opacity / 100).toString());
  }, [opacity]);
}
