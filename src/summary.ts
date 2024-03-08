import { Post } from './models/Post';

import config from "./config";

const { VertexAI } = require("@google-cloud/vertexai");


function delay(seconds: number) {
    return new Promise( resolve => setTimeout(resolve, seconds * 1000) );
}


function groupPosts(posts: Post[], maxBlockSize: number): string[] {
    let result: string[] = [];
    let currentBlock: string[] = [];
    let currentBlockSize = 0;

    for (const post of posts) {
        const textLength = post.text.length;

        if (currentBlockSize + textLength <= maxBlockSize) {
            currentBlock.push(post.text);
            currentBlockSize += textLength;
        } else {
            result.push(currentBlock.join(', '));
            currentBlock = [post.text];
            currentBlockSize = textLength;
        }
    }

    if (currentBlock.length > 0) {
        result.push(currentBlock.join(', '));
    }

    return result;
}


async function generateSummary(posts: Post[]): Promise<string> {
    const vertex_ai = new VertexAI({project: config.vertex_ai.project, location: config.vertex_ai.location});

    const generativeModel = vertex_ai.preview.getGenerativeModel({
        model: config.vertex_ai.model,
        generation_config: {
            "max_output_tokens": 4096,
            "temperature": 0.8,
            "top_p": 1,
            "top_k": 32
        },
    });

    const chat = generativeModel.startChat();
    await chat.sendMessage("Зараз я почну передавати новини які тобі потрібно запам'ятовувати а тоді треба буде підвести підсумки");
    await delay(5);

    const groups = groupPosts(posts, 4096);
    for (const group of groups) {
        await chat.sendMessage(group);
        await delay(5);
    }

    const summary = await chat.sendMessage("Завдання: Відбери теми найчастіше згадуваних новин з тих, що ти отримав(а не з інтернету) і розкажи про них, використовуючи надану інформацію. Напиши мінімум декілька речень про кожну новину та згрупуй їх за темами. Умови: Звіт повинен бути тільки українською мовою, не містити реклами чи інформацію схожу на неї та нецензурну лексику. Для форматування списку використовуйте символ '-' замість не нумерованого списку. Теми оберни в теги '<b></b>' замість символів '**'. Кожен блок новин розділяй спеціальною міткою з нового рядка ':DELIMITER:' перед кожним блоком (але на початку відповіді ':DELIMITER:' не потрібен, додавай його тільки після першого блоку новин). Не додавай блок 'Детальніше про деякі новини', краще додай цю інформацію до самих новин.");

    return summary.response.candidates[0].content.parts[0].text;
};


export { generateSummary }
