import { useState, useEffect, useRef } from "react";
import { listen } from '@tauri-apps/api/event';
import { open } from '@tauri-apps/plugin-dialog';
import { readDir } from '@tauri-apps/plugin-fs';
import Sidebar from "./components/Sidebar";
import Editor from "./components/Editor";
import { buildFileTreeRecursive } from "./lib/fileTree";
import "./App.css";

function App() {
  // Load preferences from localStorage
  const [showSidebar, setShowSidebar] = useState(() => {
    const stored = localStorage.getItem('marklee-showSidebar');
    return stored === null ? true : stored === "true";
  });
  const [isPreviewGlobal, setIsPreviewGlobal] = useState(() => {
    const stored = localStorage.getItem('marklee-isPreviewGlobal');
    return stored === null ? true : stored === "true";
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [sidebarWidth, setSidebarWidth] = useState(300);
  const [currentFolder, setCurrentFolder] = useState(null);
  const [files, setFiles] = useState([]);
  const listenersRegistered = useRef(false);

  // Load saved folder on app start
  useEffect(() => {
    const savedFolder = localStorage.getItem('marklee-folder');
    if (savedFolder) {
      loadFolder(savedFolder);
    }
  }, []);

  // Persist showSidebar and isPreviewGlobal changes
  useEffect(() => {
    localStorage.setItem('marklee-showSidebar', showSidebar);
  }, [showSidebar]);

  useEffect(() => {
    localStorage.setItem('marklee-isPreviewGlobal', isPreviewGlobal);
  }, [isPreviewGlobal]);

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

  const openFolder = async () => {
    try {
      const selected = await open({
        directory: true,
        multiple: false,
        title: 'Select Notes Folder',
        defaultPath: currentFolder || undefined
      });

      if (selected) {
        await loadFolder(selected);
      }
    } catch (error) {
      console.error('Error opening folder:', error);
    }
  };

  useEffect(() => {
    if (listenersRegistered.current) return;
    listenersRegistered.current = true;

    // Listen for menu events
    const unsubscribes = [];

    listen('menu-new', () => {
      console.log('menu-new event received');
    }).then(unsub => unsubscribes.push(unsub));

    listen('menu-open', () => {
      console.log('menu-open event received');
      openFolder();
    }).then(unsub => unsubscribes.push(unsub));

    listen('menu-open-folder', () => {
      console.log('menu-open-folder event received');
      openFolder();
    }).then(unsub => unsubscribes.push(unsub));

    listen('menu-save', () => {
      console.log('menu-save event received');
    }).then(unsub => unsubscribes.push(unsub));

    listen('menu-toggle-preview', () => {
      console.log('menu-toggle-preview event received');
      setIsPreviewGlobal(prev => !prev);
    }).then(unsub => unsubscribes.push(unsub));

    listen('menu-toggle-sidebar', () => {
      console.log('menu-toggle-sidebar event received');
      setShowSidebar(prev => !prev);
    }).then(unsub => unsubscribes.push(unsub));

    listen('menu-undo', () => {
      console.log('menu-undo event received');
    }).then(unsub => unsubscribes.push(unsub));

    listen('menu-redo', () => {
      console.log('menu-redo event received');
    }).then(unsub => unsubscribes.push(unsub));

    return () => {
      unsubscribes.forEach(unsub => unsub());
    };
  }, []);

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
          isPreviewGlobal={isPreviewGlobal}
          setIsPreviewGlobal={setIsPreviewGlobal}
        />
      </div>
    </div>
  );
}

export default App;