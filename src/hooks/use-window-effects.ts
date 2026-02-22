import { useEffect, useCallback, useRef } from "react";
import { getCurrentWebviewWindow } from "@tauri-apps/api/webviewWindow";
import { getCurrentWindow } from "@tauri-apps/api/window";
import { message } from "antd";
import { useCatStore } from "@/stores/cat-store";

/**
 * Hook for window effects.
 *
 * Responsibilities:
 * - Observe window-related state changes
 * - Call the Tauri API to apply window settings
 * - Handle click-through and always-on-top behavior
 * - Provide basic error handling
 */
export function useWindowEffects() {
  const { penetrable, alwaysOnTop, visible, opacity } = useCatStore();

  // Cache the window handle to avoid repeated lookups
  const windowRef = useRef<ReturnType<typeof getCurrentWebviewWindow> | null>(null);
  const isInitializedRef = useRef(false);

// Get window instance (cached)
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
    message.error(`Failed to reapply window flags: ${String(error)}`);
  }
}, [getWindow, penetrable, alwaysOnTop]);

	useEffect(() => {
  let unlisten: null | (() => void) = null;

  const setup = async () => {
    try {
      // Focus change event is on the Window API (Tauri v2)
		unlisten = await getCurrentWindow().onFocusChanged((event) => {
  		// Tauri v2 passes an event object with a boolean payload
  			if (event.payload) void reapplyWindowFlags();
		});
    } catch (error) {
      message.error(`Failed to listen focus changes: ${String(error)}`);
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
	
// Initial window settings
  useEffect(() => {
    if (!isInitializedRef.current) {
      isInitializedRef.current = true;

			// Apply initial always-on-top state
      const initAlwaysOnTop = async () => {
        try {
          const window = getWindow();
          await window.setAlwaysOnTop(alwaysOnTop);
        } catch (error) {
          message.error(`Failed to set window always on top: ${String(error)}`);
        }
      };

      void initAlwaysOnTop();
    }
  }, [alwaysOnTop, getWindow]);

  // click-through
  useEffect(() => {
    const applyPenetrable = async () => {
      try {
        const window = getWindow();
        await window.setIgnoreCursorEvents(penetrable);
      } catch (error) {
        message.error(`Failed to set window click-through: ${String(error)}`);
      }
    };

    void applyPenetrable();
  }, [penetrable, getWindow]);

	// Update always-on-top (skip duplicate call during init)
  useEffect(() => {
    if (!isInitializedRef.current) return;

    const applyAlwaysOnTop = async () => {
      try {
        const window = getWindow();
        await window.setAlwaysOnTop(alwaysOnTop);
      } catch (error) {
        message.error(`Failed to update window always on top: ${String(error)}`);
      }
    };

    void applyAlwaysOnTop();
  }, [alwaysOnTop, getWindow]);

  // Handle window show/hide
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
        message.error(`Failed to set window visibility: ${String(error)}`);
      }
    };

    void applyVisibility();
  }, [visible, getWindow, reapplyWindowFlags]);

  // Window transparency (via CSS variable)
  useEffect(() => {
    document.documentElement.style.setProperty("--window-opacity", (opacity / 100).toString());
  }, [opacity]);
}
