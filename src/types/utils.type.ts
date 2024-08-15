
export interface ParsedEntity {
    type: 'bold' | 'code' | 'italic' | 'strikethrough' | 'text_link' | 'spoiler' | 'underline' | 'blockquote';
    offset: number;
    length: number;
    url?: string | null;
}
