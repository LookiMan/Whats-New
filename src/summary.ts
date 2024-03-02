const { VertexAI } = require("@google-cloud/vertexai");

import config from "./config";


const vertex_ai = new VertexAI({project: config.vertex_ai.project, location: config.vertex_ai.location});


const generativeModel = vertex_ai.preview.getGenerativeModel({
    model: config.vertex_ai.model,
    generation_config: {
        "max_output_tokens": 2048,
        "temperature": 0.4,
        "top_p": 1,
        "top_k": 32
    },
});


function delay(seconds: number) {
    return new Promise( resolve => setTimeout(resolve, seconds * 1000) );
}


function groupPosts(posts: object, maxBlockSize: number): string[] {
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


async function generateSummary(posts: object): Promise<string> {
    const CONTINUE_CODE = "100"; 

    const prompt = `Зараз я почну тобі передавати новини які тобі потрібно запам'ятовувати і у відповідь присилати '${CONTINUE_CODE}', як ти мене зрозумів, то просто пришли у відповідь '${CONTINUE_CODE}'`;

    for (let i = 0; i < 3; i++) {
        const resp = await generativeModel.generateContent({
            contents: [{role: "user", parts: [{text: prompt}]}],
        });

        if (resp.response.candidates[0]?.content?.parts[0]?.text == CONTINUE_CODE) {
            break;
        } else {
            await delay(15);
        }
    }

    const groups = groupPosts(posts, 4096);

    for (const group of groups) {
        await generativeModel.generateContent({
            contents: [{role: "user", parts: [{text: group}]}],
        });
        await delay(5);
    }

    const summaryPrompt = "А тепер дай короткий підсумок самих повторюваних новин згрупованих по темах. При цьому, звіт повинен бути тільки української мовою, не містити реклами та нецензурної лексики. Для форматування списку використовуй символ '-'";

    const summary = await generativeModel.generateContent({
        contents: [{role: "user", parts: [{text: summaryPrompt}]}],
    });

    return await summary.response.candidates[0]?.content?.parts[0]?.text;
};


export { generateSummary }
