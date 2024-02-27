

export function parseEntities(rawEntities: Array) {
    const mapper = {
        MessageEntityBold: 'bold',
        MessageEntityCode: 'code',
        MessageEntityItalic: 'italic',
        MessageEntityStrike: 'strikethrough',
        MessageEntityTextUrl: 'text_link',
        MessageEntitySpoiler: 'spoiler',
        MessageEntityUnderline: 'underline',
        MessageEntityBlockquote: 'blockquote',
    }

    if (!rawEntities) {
        return null
    }

    const entities = [];
    for (const entity of rawEntities) {
        const type = mapper[entity.className];

        if (!type) {
            continue
        }

        const entityObject = { type, offset: entity.offset, length: entity.length };
        if (type === 'text_link') {
            entityObject.url = entity.url;
        }

        entities.push(entityObject);
    }

    return entities;
}
