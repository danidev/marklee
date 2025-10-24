import { readTextFile as tauriReadTextFile, writeTextFile as tauriWriteTextFile, rename as tauriRename, readDir as tauriReadDir } from '@tauri-apps/plugin-fs';
import { convertFileSrc as tauriConvertFileSrc } from '@tauri-apps/api/core';

/**
 * Reads the content of a file.
 * @param {string} filePath - The path of the file to read.
 * @returns {Promise<string>} - The content of the file.
 */
export const readTextFile = async (filePath) => {
  return await tauriReadTextFile(filePath);
};

/**
 * Writes content to a file.
 * @param {string} filePath - The path of the file to write.
 * @param {string} content - The content to write to the file.
 * @returns {Promise<void>}
 */
export const writeTextFile = async (filePath, content) => {
  return await tauriWriteTextFile(filePath, content);
};

/**
 * Renames a file or folder.
 * @param {string} oldPath - The current path of the file or folder.
 * @param {string} newPath - The new path of the file or folder.
 * @returns {Promise<void>}
 */
export const rename = async (oldPath, newPath) => {
  return await tauriRename(oldPath, newPath);
};

/**
 * Reads the contents of a directory.
 * @param {string} dirPath - The path of the directory to read.
 * @returns {Promise<Array>} - The contents of the directory.
 */
export const readDir = async (dirPath) => {
  return await tauriReadDir(dirPath);
};

/**
 * Converts a file path to a file URL.
 * @param {string} path - The path of the file to convert.
 * @returns {string} - The file URL.
 */
export function convertFileSrc(path) {
  return tauriConvertFileSrc(path);
}
