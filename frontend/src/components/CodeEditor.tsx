import React from "react";
import Editor from "@monaco-editor/react";
import type { FileItem } from "../types";

interface codeeditorprops {
  file: FileItem | null;
}

function CodeEditor({ file }: codeeditorprops) {
  if (!file) {
    return (
      <div className="h-full flex items-center justify-center text-gray-400">
        select a file
      </div>
    );
  }

  return (
    <Editor
      height={"100%"}
      defaultLanguage="typescript"
      theme="vs-dark"
      value={file.content || ""}
      options={{
        readOnly: true,
        minimap: { enabled: false },
        fontSize: 14,
        wordWrap: "on",
        scrollBeyondLastLine: false,
      }}
    />
  );
}
export default CodeEditor;
