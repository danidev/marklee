import { listen } from '@tauri-apps/api/event';
import { open } from '@tauri-apps/plugin-dialog';

/**
 * Listen to a Tauri event.
 * @param {string} eventName - The name of the event to listen for.
 * @param {Function} callback - The callback to execute when the event is triggered.
 * @returns {Promise<Function>} - A function to unsubscribe from the event.
 */
export const listenEvent = async (eventName, callback) => {
  return await listen(eventName, callback);
};

/**
 * Open a folder selection dialog.
 * @param {Object} options - Options for the dialog.
 * @returns {Promise<string|null>} - The selected folder path or null if canceled.
 */
export const openFolderDialog = async (options) => {
  return await open(options);
};
