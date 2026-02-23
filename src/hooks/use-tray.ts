"use client";

import type { TrayIconOptions } from "@tauri-apps/api/tray";
import { getName, getVersion } from "@tauri-apps/api/app";
import { resolveResource } from "@tauri-apps/api/path";
import { TrayIcon } from "@tauri-apps/api/tray";
import { message } from "antd";
import { _useMenuFactory } from "@/hooks/menu/_use-menu-factory";
import { useEffect, useRef } from "react";
import { useI18n } from "@/hooks/use-i18n";

const TRAY_ID = "BONGO_CAT_TRAY";

export function useTray() {
  const { createMenu, menuStates } = _useMenuFactory();
  const { ready } = useI18n(["menu", "window", "models", "system"]);
  const trayRef = useRef<TrayIcon | null>(null);

  const createTray = async () => {
    try {
      // 检查是否已存在托盘
      if (!ready) return;
      const existingTray = await TrayIcon.getById(TRAY_ID);
      if (existingTray) {
        trayRef.current = existingTray;
        // 更新现有托盘的菜单
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
        menuOnLeftClick: true
      };

      const tray = await TrayIcon.new(options);
      trayRef.current = tray;
      return tray;
    } catch (error) {
      message.error(`Failed to create system tray: ${String(error)}`);
    }
  };

  const updateTrayMenu = async (tray: TrayIcon) => {
    try {
      if (!ready) return;
      const menu = await createMenu({ type: "tray" });
      await tray.setMenu(menu);
    } catch (error) {
      message.error(`Failed to update tray menu: ${String(error)}`);
    }
  };

  // 🎯 监听所有状态变化，自动更新托盘菜单
  useEffect(() => {
    const updateMenu = async () => {
      if (!ready) return; 
      if (trayRef.current) {
        await updateTrayMenu(trayRef.current);
      }
    };

    void updateMenu();
  }, [menuStates, ready]); // 依赖菜单状态

  return {
    createTray
  };
}
