export interface BlockSchema {
    id: string;
    type: 'text' | 'image' | 'button' | 'divider' | 'html';
    content?: string;
    src?: string;
    href?: string;
    alt?: string;
    styles?: {
        fontSize?: string;
        fontWeight?: string;
        color?: string;
        backgroundColor?: string;
        textAlign?: 'left' | 'center' | 'right';
        padding?: string;
        margin?: string;
        borderRadius?: string;
        width?: string;
        height?: string;
    };
}

export interface ColumnSchema {
    id: string;
    blocks: BlockSchema[];
    width?: string;
}

export interface SectionSchema {
    id: string;
    columns: ColumnSchema[];
    backgroundColor?: string;
    padding?: string;
}

export interface TemplateSchema {
    sections: SectionSchema[];
    globalStyles?: {
        fontFamily?: string;
        backgroundColor?: string;
    };
}
