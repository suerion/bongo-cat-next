"use client";

import type { TrayIconOptions } from "@tauri-apps/api/tray";
import { getName, getVersion } from "@tauri-apps/api/app";
import { resolveResource } from "@tauri-apps/api/path";
import { TrayIcon } from "@tauri-apps/api/tray";
import { message } from "antd";
import { _useMenuFactory } from "@/hooks/menu/_use-menu-factory";
import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";

const TRAY_ID = "BONGO_CAT_TRAY";

export function useTray() {
  const { i18n } = useTranslation();
  const { createMenu, menuStates } = _useMenuFactory();
  const trayRef = useRef<TrayIcon | null>(null);

  const isTranslatorReady = () => {
    return !!(i18n.services && (i18n.services as any).translator);
  };

  const createTray = async () => {
    try {
      // 检查是否已存在托盘
      if (!isTranslatorReady()) {
        console.log("[useTray] Translator not ready yet, waiting...");
        return;
      }
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
      if (!isTranslatorReady()) return;
      const menu = await createMenu({ type: "tray" });
      await tray.setMenu(menu);
    } catch (error) {
      message.error(`Failed to update tray menu: ${String(error)}`);
    }
  };
	
  useEffect(() => {
    const initTray = async () => {
      if (!isTranslatorReady()) {
        setTimeout(initTray, 100);
        return;
      }
      if (!trayRef.current) {
        await createTray();
      }
    };

    void initTray();
  }, []);

  // 🎯 监听所有状态变化，自动更新托盘菜单
  useEffect(() => {
    const updateMenu = async () => {
    	const tray = trayRef.current;
    	if (!tray) return;
      if (!isTranslatorReady()) return; 

    	await updateTrayMenu(tray);
    };

    void updateMenu();
  }, [menuStates, i18n.language]); // 依赖菜单状态

  return {
    createTray
  };
}
