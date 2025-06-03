import { WebContainer } from '@webcontainer/api';
import React, { useEffect, useState } from 'react';
import type { FileItem } from '../types';

interface PreviewFrameProps {
  files: FileItem[];
  webContainer?: WebContainer;
  showWarning?: boolean;
}

export function PreviewFrame({ files, webContainer, showWarning }: PreviewFrameProps) {
  const [url, setUrl] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function main() {
    if (!webContainer) return;
    try {
      const installProcess = await webContainer.spawn('npm', ['install']);
      installProcess.output.pipeTo(new WritableStream({
        write(data) {
          console.log(data);
        }
      }));
      await webContainer.spawn('npm', ['run', 'dev']);
      webContainer.on('server-ready', (port, url) => {
        setUrl(url);
      });
    } catch (e: any) {
      setError(e.message || 'WebContainer error');
    }
  }

  useEffect(() => {
    main();
  }, []);

  if (showWarning || error?.includes('SharedArrayBuffer')) {
    return (
      <div className="h-full flex items-center justify-center text-red-400 text-center p-4">
        <div>
          <p className="mb-2 font-bold">Preview is unavailable.</p>
          <p>Your browser/server must support <code>SharedArrayBuffer</code> and be served with the following headers:</p>
          <pre className="bg-gray-800 text-gray-200 p-2 rounded mt-2 text-xs text-left">Cross-Origin-Opener-Policy: same-origin{"\n"}Cross-Origin-Embedder-Policy: require-corp</pre>
          <p className="mt-2">See <a href="https://developer.stackblitz.com/docs/webcontainers/faq/#sharedarraybuffer-error" className="underline text-blue-400" target="_blank" rel="noopener noreferrer">StackBlitz WebContainers FAQ</a> for more info.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex items-center justify-center text-gray-400">
      {!url && <div className="text-center">
        <p className="mb-2">Loading...</p>
      </div>}
      {url && <iframe width={"100%"} height={"100%"} src={url} />}
    </div>
  );
}