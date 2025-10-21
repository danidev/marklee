import { useState, useEffect } from "react";

function Sidebar({ width, onFileSelect, selectedFile, files, currentFolder, onOpenFolder }) {
  const [expanded, setExpanded] = useState(new Set());

  const toggleExpanded = (path) => {
    const newExpanded = new Set(expanded);
    if (newExpanded.has(path)) {
      newExpanded.delete(path);
    } else {
      newExpanded.add(path);
    }
    setExpanded(newExpanded);
  };

  const getFileIcon = (file) => {
    if (file.type === 'folder') {
      return expanded.has(file.path || file.name) ? '📂' : '📁';
    }
    
    switch (file.extension) {
      case 'md': return '📝';
      case 'txt': return '📄';
      case 'csv': return '📊';
      case 'png':
      case 'jpg':
      case 'jpeg': return '🖼️';
      default: return '📄';
    }
  };

  const getFileCount = (folder) => {
    if (folder.type !== 'folder' || !folder.children) return 0;
    
    let count = 0;
    folder.children.forEach(child => {
      if (child.type === 'file') {
        count++;
      } else if (child.type === 'folder') {
        count += getFileCount(child);
      }
    });
    return count;
  };

  const renderFile = (file, level = 0) => {
    console.log(file.type);

    const isExpanded = expanded.has(file.path || file.name);
    const isSelected = selectedFile?.path === file.path;
    const fileCount = file.type === 'folder' ? getFileCount(file) : 0;

    return (
      <div key={file.path || file.name}>
        <div 
          className={`flex items-center py-2 px-3 cursor-pointer select-none text-sm transition-colors ${
            isSelected 
              ? 'bg-blue-500 text-white' 
              : 'text-gray-700 hover:bg-gray-100'
          }`}
          style={{ paddingLeft: `${level * 16 + 12}px` }}
          onClick={() => {
            if (file.type === 'folder') {
              toggleExpanded(file.path || file.name);
            } else {
              onFileSelect(file);
            }
          }}
        >
          <span className="mr-4 text-sm">
            {getFileIcon(file)}
          </span>
          <span className="truncate text-xs flex-1">{file.name}</span>
          {file.type === 'folder' && fileCount > 0 && (
            <span className={`text-xs ml-2 px-1.5 py-0.5 rounded ${
              isSelected 
                ? 'bg-blue-400 text-white' 
                : 'bg-gray-200 text-gray-600'
            }`}>
            </span>
          )}
        </div>
        {file.type === 'folder' && isExpanded && file.children && (
          <div>
            {file.children.map(child => renderFile(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="bg-white border-r border-gray-200 flex flex-col overflow-hidden" style={{ width: `${width}px` }}>
      {!currentFolder ? (
        <div className="flex-1 flex flex-col items-center justify-center p-4 text-center">
          <p className="text-gray-500 text-sm mb-4">No folder selected</p>
          <button
            onClick={onOpenFolder}
            className="px-4 py-2 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition-colors"
          >
            Open Folder
          </button>
        </div>
      ) : (
        <>
          <div className="p-3 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-600 truncate" title={currentFolder}>
                {currentFolder.split('/').pop()}
              </span>
              <button
                onClick={onOpenFolder}
                className="text-xs text-blue-500 hover:text-blue-700"
              >
                Change
              </button>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto py-2">
            {files.length > 0 ? (
              files.map(file => renderFile(file))
            ) : (
              <div className="p-4 text-center text-gray-500 text-sm">
                No supported files found (.md, .txt, .csv, images)
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default Sidebar;