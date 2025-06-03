import { useEffect, useState } from "react";
import { WebContainer } from '@webcontainer/api';

let webcontainerInstance: WebContainer | undefined;

export function useWebContainer() {
    const [webcontainer, setWebcontainer] = useState<WebContainer>();

    useEffect(() => {
        let isMounted = true;
        async function main() {
            if (!webcontainerInstance) {
                webcontainerInstance = await WebContainer.boot();
            }
            if (isMounted) {
                setWebcontainer(webcontainerInstance);
            }
        }
        main();
        return () => { isMounted = false; };
    }, []);

    return webcontainer;
}