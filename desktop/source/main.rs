// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

// Exemplo conceitual para Windows usando a API Win32
#[cfg(target_os = "windows")]
use windows::Win32::UI::WindowsAndMessaging::{SetWindowDisplayAffinity, WDA_EXCLUDEFROMCAPTURE};

#[cfg(target_os = "windows")]
pub fn hide_from_capture(window: &tauri::Window) {
    if let Ok(hwnd) = window.hwnd() {
        unsafe {
            let _ = SetWindowDisplayAffinity(hwnd.0 as _, WDA_EXCLUDEFROMCAPTURE);
        }
    }
}

fn main() {
    application_lib::run()
}
