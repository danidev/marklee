import { useState, useEffect } from "react";
import { readTextFile, readFile } from '@tauri-apps/plugin-fs';
import { marked } from "marked";

function Editor({ file, isPreviewGlobal, setIsPreviewGlobal }) {
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [imageData, setImageData] = useState(null);

  useEffect(() => {
    if (file && file.path) {
      if (isImageFile(file)) {
        loadImageFile(file.path);
      } else {
        loadFileContent(file.path);
      }
    } else {
      setContent("");
      setImageData(null);
    }
  }, [file]);

  // Add keyboard shortcut for Ctrl+E
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.ctrlKey && event.key === 'e') {
        event.preventDefault();
        // Only toggle if we're viewing a text file (not image)
        if (file && !isImageFile(file)) {
          setIsPreviewGlobal(prev => !prev);
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [file]);

  const isImageFile = (file) => {
    return file && ['png', 'jpg', 'jpeg'].includes(file.extension);
  };

  const loadImageFile = async (filePath) => {
    try {
      setIsLoading(true);
      // Read image as binary and convert to base64
      const imageBytes = await readFile(filePath);
      const base64 = btoa(String.fromCharCode(...new Uint8Array(imageBytes)));
      const mimeType = `image/${file.extension === 'jpg' ? 'jpeg' : file.extension}`;
      setImageData(`data:${mimeType};base64,${base64}`);
    } catch (error) {
      console.error('Error loading image as base64:', error);
      setImageData(null);
    } finally {
      setIsLoading(false);
    }
  };

  const loadFileContent = async (filePath) => {
    try {
      setIsLoading(true);
      const fileContent = await readTextFile(filePath);
      setContent(fileContent);
    } catch (error) {
      console.error('Error loading file:', error);
      setContent("Error loading file: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleContentChange = (e) => {
    setContent(e.target.value);
  };

  if (!file) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-gray-500 text-center bg-white">
        <h2 className="text-xl font-medium mb-4 m-0 text-gray-900">Select a file to start editing</h2>
        <p className="text-sm m-0">Choose a markdown file from the sidebar or open a folder.</p>
      </div>
    );
  }

  // Shared header for both image and text files
  const header = (
    <div className="flex items-center justify-between px-3 border-b border-gray-200 bg-gray-50 h-14 min-h-[56px]">
      <span className="text-xs text-gray-600 truncate font-semibold flex items-center h-14 min-h-[56px]" title={file.name}>
        {file.name}
      </span>
      {!isImageFile(file) ? (
        <div className="flex gap-2 items-center h-14 min-h-[56px]">
          <button 
            className={`px-3 py-1.5 border rounded text-xs font-medium cursor-pointer transition-colors ${
              !isPreviewGlobal 
                ? 'bg-blue-500 text-white border-blue-500' 
                : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
            }`}
            onClick={() => setIsPreviewGlobal(false)}
          >
            Edit
          </button>
          <button 
            className={`px-3 py-1.5 border rounded text-xs font-medium cursor-pointer transition-colors ${
              isPreviewGlobal 
                ? 'bg-blue-500 text-white border-blue-500' 
                : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
            }`}
            onClick={() => setIsPreviewGlobal(true)}
          >
            Preview
          </button>
        </div>
      ) : (
        <div className="h-14 min-h-[56px] flex items-center" />
      )}
    </div>
  );

  // Handle image files
  if (isImageFile(file)) {
    return (
      <div className="flex flex-col h-screen bg-white">
        {header}
        <div className="flex-1 overflow-auto p-6 bg-gray-50">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-gray-500">Loading image...</div>
            </div>
          ) : imageData ? (
            <div className="flex items-center justify-center min-h-full">
              <img 
                src={imageData}
                alt={file.name}
                className="max-w-full max-h-full object-contain rounded shadow-lg bg-white p-2"
              />
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center text-gray-500 p-8 bg-white rounded shadow">
                <p>Unable to display image</p>
                <p className="text-xs mt-2">{file.name}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Handle text files
  return (
    <div className="flex flex-col h-screen bg-white">
      {header}
      <div className="flex-1 overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-gray-500">Loading...</div>
          </div>
        ) : isPreviewGlobal ? (
          <div 
            className="prose prose-sm prose-blue p-6 h-full overflow-y-auto text-gray-900 max-w-none"
            dangerouslySetInnerHTML={{ __html: marked.parse(content) }}
          />
        ) : (
          <textarea
            className="w-full h-full border-none outline-none p-6 font-mono text-sm leading-relaxed resize-none bg-white text-gray-900 placeholder-gray-500"
            value={content}
            onChange={handleContentChange}
            placeholder="Start writing..."
          />
        )}
      </div>
    </div>
  );
}

export default Editor;