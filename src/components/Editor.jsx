import { useState, useEffect } from "react";
import { readTextFile } from '@tauri-apps/plugin-fs';

function Editor({ file, onFileChange }) {
  const [content, setContent] = useState("");
  const [isPreview, setIsPreview] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (file && file.path) {
      loadFileContent(file.path);
    } else {
      setContent("");
    }
  }, [file]);

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

  const renderMarkdown = (text) => {
    // Simple markdown renderer for now
    return text
      .replace(/^# (.*$)/gim, '<h1 class="text-2xl font-semibold mb-4 text-gray-900">$1</h1>')
      .replace(/^## (.*$)/gim, '<h2 class="text-xl font-semibold mb-3 mt-6 text-gray-900">$1</h2>')
      .replace(/^### (.*$)/gim, '<h3 class="text-lg font-semibold mb-2 mt-5 text-gray-900">$1</h3>')
      .replace(/\*\*(.*)\*\*/gim, '<strong class="font-semibold">$1</strong>')
      .replace(/\*(.*)\*/gim, '<em class="italic">$1</em>')
      .replace(/^\- (.*$)/gim, '<li class="mb-1">$1</li>')
      .replace(/\n/gim, '<br>');
  };

  if (!file) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-gray-500 text-center bg-white">
        <h2 className="text-xl font-medium mb-4 m-0 text-gray-900">Select a file to start editing</h2>
        <p className="text-sm m-0">Choose a markdown file from the sidebar or open a folder.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-white">
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gray-50">
        <h2 className="text-base font-semibold text-gray-900 m-0">{file.name}</h2>
        <div className="flex gap-2">
          <button 
            className={`px-3 py-1.5 border rounded text-xs font-medium cursor-pointer transition-colors ${
              !isPreview 
                ? 'bg-blue-500 text-white border-blue-500' 
                : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
            }`}
            onClick={() => setIsPreview(false)}
          >
            Edit
          </button>
          <button 
            className={`px-3 py-1.5 border rounded text-xs font-medium cursor-pointer transition-colors ${
              isPreview 
                ? 'bg-blue-500 text-white border-blue-500' 
                : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
            }`}
            onClick={() => setIsPreview(true)}
          >
            Preview
          </button>
        </div>
      </div>
      
      <div className="flex-1 overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-gray-500">Loading...</div>
          </div>
        ) : isPreview ? (
          <div 
            className="p-6 h-full overflow-y-auto text-sm leading-relaxed text-gray-900"
            dangerouslySetInnerHTML={{ __html: renderMarkdown(content) }}
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
