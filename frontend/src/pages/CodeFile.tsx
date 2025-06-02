import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import StepList from '../components/StepList';
import FileExplorer from '../components/FileExplorer';
import { TabView } from '../components/TabView';
import CodeEditor from '../components/CodeEditor';
import { PreviewFrame } from '../components/PreviewFrame';
import type { Step, FileItem } from '../types';
import { StepType } from '../types';
import axios from 'axios';
import { BACKEND_URL } from '../config';
import { parseXml } from '../steps';
import { useWebContainer } from '../hooks/useWebContainer';
import { Loader } from '../components/Loader';
interface MountFile {
  file: {
    contents: string;
  };
}

interface MountDirectory {
  directory: Record<string, MountItem>;
}

type MountItem = MountFile | MountDirectory;

function CodeFile() {
  const location = useLocation();
  const { prompt } = location.state as { prompt: string };
  const [userPrompt, setPrompt] = useState("");
  const [llmMessages, setLlmMessages] = useState<{ role: "user" | "assistant", content: string; }[]>([]);
  const [loading, setLoading] = useState(false);
  const [templateSet, setTemplateSet] = useState(false);
  const webcontainer = useWebContainer();
  const [currentStep, setCurrentStep] = useState(1);
  const [activeTab, setActiveTab] = useState<'code' | 'preview'>('code');
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null);
  const [steps, setSteps] = useState<Step[]>([]);
  const [files, setFiles] = useState<FileItem[]>([]);

  useEffect(() => {
    let originalFiles = [...files];
    let updateHappened = false;
    steps.filter(({ status }) => status === "pending").forEach(step => {
      updateHappened = true;
      if (step?.type === StepType.CreateFile) {
        let parsedPath = step.path?.split("/") ?? [];
        let currentFileStructure = [...originalFiles];
        const finalAnswerRef = currentFileStructure;

        let currentFolder = "";
        while (parsedPath.length) {
          currentFolder = `${currentFolder}/${parsedPath[0]}`;
          const currentFolderName = parsedPath[0];
          parsedPath = parsedPath.slice(1);

          if (!parsedPath.length) {
            const file = currentFileStructure.find(x => x.path === currentFolder);
            if (!file) {
              currentFileStructure.push({
                name: currentFolderName,
                type: 'file',
                path: currentFolder,
                content: step.code
              });
            } else {
              file.content = step.code;
            }
          } else {
            const folder = currentFileStructure.find(x => x.path === currentFolder);
            if (!folder) {
              currentFileStructure.push({
                name: currentFolderName,
                type: 'folder',
                path: currentFolder,
                children: []
              });
            }
            currentFileStructure = currentFileStructure.find(x => x.path === currentFolder)!.children!;
          }
        }
        originalFiles = finalAnswerRef;
      }
    });

    if (updateHappened) {
      setFiles(originalFiles);
      setSteps(steps => steps.map((s: Step) => ({ ...s, status: "completed" })));
    }
  }, [steps, files]);

  useEffect(() => {
    const createMountStructure = (files: FileItem[]): Record<string, MountItem> => {
      const mountStructure: Record<string, MountItem> = {};

      const processFile = (file: FileItem, isRoot: boolean) => {
        if (file.type === 'folder') {
          mountStructure[file.name] = {
            directory: file.children ? Object.fromEntries(
              file.children.map(child => [child.name, processFile(child, false)])
            ) : {}
          };
        } else {
          if (isRoot) {
            mountStructure[file.name] = {
              file: {
                contents: file.content || ''
              }
            };
          } else {
            return {
              file: {
                contents: file.content || ''
              }
            };
          }
        }
        return mountStructure[file.name];
      };

      files.forEach(file => processFile(file, true));
      return mountStructure;
    };

    const mountStructure = createMountStructure(files);
    webcontainer?.mount(mountStructure);
  }, [files, webcontainer]);

  async function init() {
    const response = await axios.post(`${BACKEND_URL}/template`, { prompt: prompt.trim() });
    setTemplateSet(true);
    const { prompts, uiPrompts } = response.data;
    setSteps(parseXml(uiPrompts[0]).map((x: Step) => ({ ...x, status: "pending" })));

    setLoading(true);
    const stepsResponse = await axios.post(`${BACKEND_URL}/chat`, {
      messages: [...prompts, prompt].map(content => ({ role: "user", content }))
    });
    setLoading(false);

    setSteps(s => [...s, ...parseXml(stepsResponse.data.response).map(x => ({ ...x, status: "pending" as 'pending' }))]);
    setLlmMessages([...prompts, prompt].map(content => ({ role: "user", content })));
    setLlmMessages(x => [...x, { role: "assistant", content: stepsResponse.data.response }]);
  }

  useEffect(() => { init(); }, []);

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      <header className="bg-gray-800 border-b border-gray-700 px-6 py-4">
        <h1 className="text-xl font-semibold text-gray-100">Website Builder</h1>
        <p className="text-sm text-gray-400 mt-1">Prompt: {prompt}</p>
      </header>

      <div className="flex-1 overflow-hidden">
        <div className="h-full grid grid-cols-[1fr_1fr_2fr] gap-6 p-6">

          {/* Steps */}
          <div className="col-span-1 overflow-auto max-h-full">
            <StepList steps={steps} currentStep={currentStep} onStepClick={setCurrentStep} />
            <div className='mt-4'>
              {(loading || !templateSet) && <Loader />}
              {!loading && templateSet && (
                <div className="flex flex-col gap-2">
                  <textarea value={userPrompt} onChange={(e) => setPrompt(e.target.value)} className="p-2 w-full rounded-md" />
                  <button
                    onClick={async () => {
                      const newMessage = { role: "user" as const, content: userPrompt };
                      setLoading(true);
                      const stepsResponse = await axios.post(`${BACKEND_URL}/chat`, {
                        messages: [...llmMessages, newMessage]
                      });
                      setLoading(false);
                      setLlmMessages(x => [...x, newMessage, { role: "assistant", content: stepsResponse.data.response }]);
                      setSteps(s => [...s, ...parseXml(stepsResponse.data.response).map(x => ({ ...x, status: "pending" as 'pending' }))]);
                    }}
                    className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-1 rounded-md"
                  >
                    Send
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* File Explorer */}
          <div className="col-span-1 overflow-auto">
            <FileExplorer files={files} onFileSelect={setSelectedFile} />
          </div>

          {/* Code / Preview */}
          <div className="col-span-1 bg-gray-800 rounded-lg shadow-lg p-4 min-h-[calc(100vh-8rem)] flex flex-col">
            <TabView activeTab={activeTab} onTabChange={setActiveTab} />
            <div className="flex-1 overflow-auto">
              {activeTab === 'code' ? (
                <CodeEditor file={selectedFile} />
              ) : (
                <PreviewFrame webContainer={webcontainer} files={files} />
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default CodeFile;
