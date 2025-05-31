require('dotenv').config();

const apiKey = process.env.COHERE_API_KEY;


import { CohereClient } from "cohere-ai";

const cohere = new CohereClient({
    token: apiKey,
});

(async () => {
    const stream = await cohere.chatStream({
        model: "command",
        message: "create a simple todo app",
    });

    for await (const chat of stream) {
        if (chat.eventType === "text-generation") {
            process.stdout.write(chat.text);
        }
    }
})();