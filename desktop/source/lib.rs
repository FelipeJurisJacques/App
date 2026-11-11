// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
async fn toggle_assist_mode(window: tauri::Window) -> Result<(), String> {
    let is_decorated = window.is_decorated().unwrap_or(false);

    if is_decorated {
        // Restaurar janela normal
        window.set_decorations(true).map_err(|e| e.to_string())?;
        #[cfg(target_os = "windows")]
        {
            use windows::Win32::UI::WindowsAndMessaging::{SetWindowDisplayAffinity, WDA_NORMAL};
            if let Ok(hwnd) = window.hwnd() {
                unsafe {
                    let _ = SetWindowDisplayAffinity(hwnd.0 as _, WDA_NORMAL);
                }
            }
        }
    } else {
        // Ativar modo assistido
        window.set_decorations(false).map_err(|e| e.to_string())?;
        #[cfg(target_os = "windows")]
        {
            use windows::Win32::UI::WindowsAndMessaging::{SetWindowDisplayAffinity, WDA_EXCLUDEFROMCAPTURE};
            if let Ok(hwnd) = window.hwnd() {
                unsafe {
                    let _ = SetWindowDisplayAffinity(hwnd.0 as _, WDA_EXCLUDEFROMCAPTURE);
                }
            }
        }
    }

    Ok(())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![greet, toggle_assist_mode])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
