// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::menu::{Menu, MenuItem, PredefinedMenuItem, Submenu};
use tauri::{Manager, Emitter};

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_fs::init())
        .setup(|app| {
            // Create File menu
            let file_menu = Submenu::with_items(
                app,
                "File",
                true,
                &[
                    &MenuItem::with_id(app, "open-folder", "Open Folder", true, Some("CmdOrCtrl+Shift+O"))?,
                    &MenuItem::with_id(app, "new", "New", true, Some("CmdOrCtrl+N"))?,
                    &MenuItem::with_id(app, "save", "Save", true, Some("CmdOrCtrl+S"))?,
                    &PredefinedMenuItem::separator(app)?,
                    &PredefinedMenuItem::quit(app, Some("Quit"))?,
                ],
            )?;

            // Create Edit menu
            let edit_menu = Submenu::with_items(
                app,
                "Edit",
                true,
                &[
                    &MenuItem::with_id(app, "undo", "Undo", true, Some("CmdOrCtrl+Z"))?,
                    &MenuItem::with_id(app, "redo", "Redo", true, Some("CmdOrCtrl+Shift+Z"))?,
                    &PredefinedMenuItem::separator(app)?,
                    &PredefinedMenuItem::cut(app, Some("Cut"))?,
                    &PredefinedMenuItem::copy(app, Some("Copy"))?,
                    &PredefinedMenuItem::paste(app, Some("Paste"))?,
                ],
            )?;

            // Create View menu
            let view_menu = Submenu::with_items(
                app,
                "View",
                true,
                &[
                    &MenuItem::with_id(app, "toggle-preview", "Toggle Preview", true, Some("CmdOrCtrl+E"))?,
                    &MenuItem::with_id(app, "toggle-sidebar", "Toggle Sidebar", true, Some("CmdOrCtrl+B"))?,
                    &MenuItem::with_id(app, "increase-font-size", "Increase Font Size", true, Some("CmdOrCtrl+1"))?, // Updated shortcut
                    &MenuItem::with_id(app, "decrease-font-size", "Decrease Font Size", true, Some("CmdOrCtrl+-"))?,
                ],
            )?;

            // Create main menu
            let menu = Menu::with_items(app, &[&file_menu, &edit_menu, &view_menu])?;

            // Set menu for the main window
            let window = app.get_webview_window("main").unwrap();
            window.set_menu(menu)?;

            // Handle menu events
            app.on_menu_event(move |app, event| {
                if let Some(window) = app.get_webview_window("main") {
                    match event.id().as_ref() {
                        "new" => {
                            println!("New file requested");
                            window.emit("menu-new", ()).unwrap();
                        }
                        "open" => {
                            println!("Open file requested");
                            window.emit("menu-open", ()).unwrap();
                        }
                        "open-folder" => {
                            println!("Open folder requested");
                            window.emit("menu-open-folder", ()).unwrap();
                        }
                        "save" => {
                            println!("Save file requested");
                            window.emit("menu-save", ()).unwrap();
                        }
                        "undo" => {
                            println!("Undo requested");
                            window.emit("menu-undo", ()).unwrap();
                        }
                        "redo" => {
                            println!("Redo requested");
                            window.emit("menu-redo", ()).unwrap();
                        }
                        "toggle-preview" => {
                            println!("Toggle preview requested");
                            window.emit("menu-toggle-preview", ()).unwrap();
                        }
                        "toggle-sidebar" => {
                            println!("Toggle sidebar requested");
                            window.emit("menu-toggle-sidebar", ()).unwrap();
                        }
                        "increase-font-size" => {
                            println!("Increase font size requested");
                            window.emit("menu-increase-font-size", ()).unwrap();
                        }
                        "decrease-font-size" => {
                            println!("Decrease font size requested");
                            window.emit("menu-decrease-font-size", ()).unwrap();
                        }
                        _ => {}
                    }
                }
            });

            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
