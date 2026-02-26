"use client";

import type { TrayIconOptions } from "@tauri-apps/api/tray";
import { getName, getVersion } from "@tauri-apps/api/app";
import { resolveResource } from "@tauri-apps/api/path";
import { TrayIcon } from "@tauri-apps/api/tray";
import { message } from "antd";
import { _useMenuFactory } from "@/hooks/menu/_use-menu-factory";
import { useEffect, useRef, useCallback } from "react";
import { useTranslation } from "react-i18next";

const TRAY_ID = "BONGO_CAT_TRAY";

function hasTranslator(i18nInstance: unknown): boolean {
  const i = i18nInstance as { services?: unknown };
  const services = i.services;
  if (!services || typeof services !== "object") return false;
  return "translator" in (services as Record<string, unknown>);
}

export function useTray() {
  const { i18n } = useTranslation();
  const { createMenu, menuStates } = _useMenuFactory();
  const trayRef = useRef<TrayIcon | null>(null);

  const isTranslatorReady = useCallback(() => hasTranslator(i18n), [i18n]);

  const createTray = async () => {
    try {
      if (!isTranslatorReady()) return;

      const existingTray = await TrayIcon.getById(TRAY_ID);
      if (existingTray) {
        trayRef.current = existingTray;
        await updateTrayMenu(existingTray);
        return existingTray;
      }

      const appName = await getName();
      const appVersion = await getVersion();
      const menu = await createMenu({ type: "tray" });
      const icon = await resolveResource("assets/tray.png");

      const options: TrayIconOptions = {
        menu,
        icon,
        id: TRAY_ID,
        tooltip: `${appName} v${appVersion}`,
        iconAsTemplate: false,
        menuOnLeftClick: true,
      };

      const tray = await TrayIcon.new(options);
      trayRef.current = tray;
      return tray;
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      message.error(`Failed to create system tray: ${errorMessage}`);
    }
  };

  const updateTrayMenu = async (tray: TrayIcon) => {
    try {
      if (!isTranslatorReady()) return;
      const menu = await createMenu({ type: "tray" });
      await tray.setMenu(menu);
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      message.error(`Failed to update tray menu: ${errorMessage}`);
    }
  };

  useEffect(() => {
    const initTray = async () => {
      if (!isTranslatorReady()) {
        setTimeout(() => {
          void initTray();
        }, 100);
        return;
      }
      if (!trayRef.current) {
        await createTray();
      }
    };

    void initTray();
  }, [isTranslatorReady]);

  useEffect(() => {
    const tray = trayRef.current;
    if (!tray) return;
    if (!isTranslatorReady()) return;

    const updateMenuAsync = async () => {
      await updateTrayMenu(tray);
    };

    updateMenuAsync().catch((error: unknown) => {
      console.error("[useTray] Failed to update menu:", error);
    });
  }, [menuStates, i18n.language, isTranslatorReady]);

  return { createTray };
}
