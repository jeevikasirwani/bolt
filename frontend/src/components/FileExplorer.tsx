import React, { useState } from 'react'
import type { FileItem } from '../types'
import { FaChevronDown, FaChevronRight, FaFile } from 'react-icons/fa';
import { FaFolderTree } from "react-icons/fa6";



interface FileExplorerProps{
    files:FileItem[];
    onFileSelect: (file: FileItem) => void;
}


interface FileNodeProps{
    item:FileItem;
    depth:number;
     onFileClick: (file: FileItem) => void;
}


function FileNode({item,depth,onFileClick}:FileNodeProps){
    const [isExpanded,setIsExpanded]=useState(false);


    const handleClick=()=>{
        if(item.type==='folder'){
            setIsExpanded(!isExpanded)
        }
        else{
            onFileClick(item);
        }
    }
    return (
        <div className='select-none bg-slate-900/90'>
            <div className=' flex items-center gap-2 p-2 hover:bg-gray-800 rounded-md cursor-pointer pl-1.5 break-words' onClick={handleClick}>

                {item.type==='folder'&& (
                    <span className='text-gray-400'>
                        {isExpanded?(
                            <FaChevronDown className='w-4 h-4'/>
                        ):(<FaChevronRight className='w-4 h-4'/>
                        )}
                    </span>
                )}
                {item.type==='folder'?(
                    <FaFolderTree className="w-4 h-4 text-blue-400"/>
                ):(
                    <FaFile className="w-4 h-4 text-gray-400"/>
                )
                }
                <span className='text-gray-200 break-words'>{item.name}</span>

            </div>
            {item.type==='folder'&& isExpanded && item.children && (
                <div>
                    {item.children.map((child,index)=>(
                        <FileNode
                        key={`${child.path}-${index}`}
                        item={child}
                        depth={depth+1}
                        onFileClick={onFileClick}/>
                    ))}
                </div>
            )}
        </div>
    )
}
function FileExplorer({files,onFileSelect}:FileExplorerProps) {
  return (
    <div className="bg-gray-900 rounded-lg shadow-lg p-4 h-full min-w-[220px] max-w-xs w-full">
      <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-100">
        <FaFolderTree className="w-5 h-5" />
        File Explorer
      </h2>
      <div className="space-y-1 break-words">
        {files.map((file, index) => (
          <FileNode
            key={`${file.path}-${index}`}
            item={file}
            depth={0}
            onFileClick={onFileSelect}
          />
        ))}
      </div>
    </div>
  )
}

export default FileExplorer