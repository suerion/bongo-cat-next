use rdev::{Event, EventType, listen};
use serde::Serialize;
use serde_json::{Value, json};
use std::sync::atomic::{AtomicBool, Ordering};
use tauri::{AppHandle, Emitter};

static IS_RUNNING: AtomicBool = AtomicBool::new(false);

#[derive(Debug, Clone, Serialize)]
pub enum DeviceKind {
    MousePress,
    MouseRelease,
    MouseMove,
    KeyboardPress,
    KeyboardRelease,
}

#[derive(Debug, Clone, Serialize)]
pub struct DeviceEvent {
    kind: DeviceKind,
    value: Value,
}

pub fn start_listening(app_handle: AppHandle) {
    if IS_RUNNING.load(Ordering::SeqCst) {
        return;
    }

    IS_RUNNING.store(true, Ordering::SeqCst);

    let callback = move |event: Event| {
        match &event.event_type {
            EventType::ButtonPress(button) => {
                println!("[device] MousePress {:?}", button);
            }
            EventType::ButtonRelease(button) => {
                println!("[device] MouseRelease {:?}", button);
            }
            EventType::MouseMove { x, y } => {
                println!("[device] MouseMove x={x} y={y}");
            }
            EventType::KeyPress(key) => {
                println!("[device] KeyPress {:?}", key);
            }
            EventType::KeyRelease(key) => {
                println!("[device] KeyRelease {:?}", key);
            }
            _ => return,
        }

        let device = match event.event_type {
            EventType::ButtonPress(button) => DeviceEvent {
                kind: DeviceKind::MousePress,
                value: json!(format!("{:?}", button)),
            },
            EventType::ButtonRelease(button) => DeviceEvent {
                kind: DeviceKind::MouseRelease,
                value: json!(format!("{:?}", button)),
            },
            EventType::MouseMove { x, y } => DeviceEvent {
                kind: DeviceKind::MouseMove,
                value: json!({ "x": x, "y": y }),
            },
            EventType::KeyPress(key) => DeviceEvent {
                kind: DeviceKind::KeyboardPress,
                value: json!(format!("{:?}", key)),
            },
            EventType::KeyRelease(key) => DeviceEvent {
                kind: DeviceKind::KeyboardRelease,
                value: json!(format!("{:?}", key)),
            },
            _ => return,
        };

        if let Err(e) = app_handle.emit("device-changed", device) {
            eprintln!("Failed to emit event: {:?}", e);
        }
    };

    #[cfg(target_os = "macos")]
    if let Err(e) = listen(callback) {
        eprintln!("Device listening error: {:?}", e);
    }

    #[cfg(not(target_os = "macos"))]
    std::thread::spawn(move || {
        if let Err(e) = listen(callback) {
            eprintln!("Device listening error: {:?}", e);
        }
    });
}
