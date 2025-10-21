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
      <div className="p-3 border-b border-gray-200 bg-gray-50 h-14 min-h-[56px] flex items-center">
        <div className="flex items-center justify-between w-full">
          <span className="text-xs text-gray-600 truncate" title={currentFolder}>
            {currentFolder ? currentFolder.split('/').pop() : 'No folder selected'}
          </span>
          <button
            onClick={onOpenFolder}
            className="text-xs text-blue-500 hover:text-blue-700"
          >
            {currentFolder ? 'Change' : 'Open Folder'}
          </button>
        </div>
      </div>
      {currentFolder && (<div className="flex-1 overflow-y-auto py-2">
        {files.map(file => renderFile(file))}
      </div>)}
    </div>
  );
}

export default Sidebar;