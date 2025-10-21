import { useState, useEffect } from "react";
import { listen } from '@tauri-apps/api/event';
import { open } from '@tauri-apps/plugin-dialog';
import { readDir } from '@tauri-apps/plugin-fs';
import Sidebar from "./components/Sidebar";
import Editor from "./components/Editor";
import "./App.css";

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [sidebarWidth, setSidebarWidth] = useState(300);
  const [showSidebar, setShowSidebar] = useState(true);
  const [editorRef, setEditorRef] = useState(null);
  const [currentFolder, setCurrentFolder] = useState(null);
  const [files, setFiles] = useState([]);

  // Load saved folder on app start
  useEffect(() => {
    const savedFolder = localStorage.getItem('marklee-folder');
    if (savedFolder) {
      loadFolder(savedFolder);
    }
  }, []);

  const loadFolder = async (folderPath) => {
    try {
      const fileTree = await buildFileTreeRecursive(folderPath);
      setFiles(fileTree);
      setCurrentFolder(folderPath);
      localStorage.setItem('marklee-folder', folderPath);
    } catch (error) {
      console.error('Error loading folder:', error);
      // Clear invalid folder from localStorage
      localStorage.removeItem('marklee-folder');
      setCurrentFolder(null);
      setFiles([]);
    }
  };

  const buildFileTreeRecursive = async (dirPath) => {
    const supportedExtensions = ['.md', '.txt', '.csv', '.png', '.jpg', '.jpeg'];

    const isSupportedFile = (filename) => {
      return supportedExtensions.some(ext => filename.toLowerCase().endsWith(ext));
    };

    const readDirRecursive = async (currentPath) => {
      try {
        const entries = await readDir(currentPath);
        const items = [];

        for (const entry of entries) {
          const fullPath = `${currentPath}/${entry.name}`;

          if (entry.isDirectory) {
            const children = await readDirRecursive(fullPath);
            
            if (children.length > 0) {
              items.push({
                name: entry.name,
                type: 'folder',
                path: fullPath,
                children: children
              });
            }
          } else if (entry.isFile && isSupportedFile(entry.name)) {
            items.push({
              name: entry.name,
              type: 'file',
              path: fullPath,
              extension: entry.name.split('.').pop().toLowerCase()
            });
          }
        }

        return items.sort((a, b) => {
          if (a.type === b.type) return a.name.localeCompare(b.name);
          return a.type === 'folder' ? -1 : 1;
        });
      } catch (error) {
        console.error(`Error reading directory ${currentPath}:`, error);
        return [];
      }
    };

    return await readDirRecursive(dirPath);
  };

  const openFolder = async () => {
    try {
      const selected = await open({
        directory: true,
        multiple: false,
        title: 'Select Notes Folder'
      });

      if (selected) {
        await loadFolder(selected);
      }
    } catch (error) {
      console.error('Error opening folder:', error);
    }
  };

  useEffect(() => {
    // Listen for menu events
    const unsubscribes = [];

    listen('menu-new', () => {
      // Handle new file
    }).then(unsub => unsubscribes.push(unsub));

    listen('menu-open', () => {
      openFolder();
    }).then(unsub => unsubscribes.push(unsub));

    listen('menu-open-folder', () => {
      openFolder();
    }).then(unsub => unsubscribes.push(unsub));

    listen('menu-save', () => {
      // Handle save file
      if (editorRef?.save) {
        editorRef.save();
      }
    }).then(unsub => unsubscribes.push(unsub));

    listen('menu-toggle-preview', () => {
      if (editorRef?.togglePreview) {
        editorRef.togglePreview();
      }
    }).then(unsub => unsubscribes.push(unsub));

    listen('menu-toggle-sidebar', () => {
      setShowSidebar(prev => !prev);
    }).then(unsub => unsubscribes.push(unsub));

    listen('menu-undo', () => {
      if (editorRef?.undo) {
        editorRef.undo();
      }
    }).then(unsub => unsubscribes.push(unsub));

    listen('menu-redo', () => {
      if (editorRef?.redo) {
        editorRef.redo();
      }
    }).then(unsub => unsubscribes.push(unsub));

    return () => {
      unsubscribes.forEach(unsub => unsub());
    };
  }, [editorRef]);

  return (
    <div className="flex h-screen w-screen bg-white">
      {showSidebar && (
        <Sidebar 
          width={sidebarWidth}
          onFileSelect={setSelectedFile}
          selectedFile={selectedFile}
          files={files}
          currentFolder={currentFolder}
          onOpenFolder={openFolder}
        />
      )}
      <div className="flex-1 overflow-hidden">
        <Editor 
          file={selectedFile}
          onFileChange={setSelectedFile}
          ref={setEditorRef}
        />
      </div>
    </div>
  );
}

export default App;