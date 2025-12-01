import { Injectable } from '@nestjs/common';

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

@Injectable()
export class HtmlRenderService {
    renderFromSchema(schema: TemplateSchema): string {
        const sections = schema.sections.map(section => this.renderSection(section)).join('\n');

        return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body {
      margin: 0;
      padding: 0;
      font-family: ${schema.globalStyles?.fontFamily || 'Arial, sans-serif'};
      background-color: ${schema.globalStyles?.backgroundColor || '#f4f4f4'};
    }
    .email-container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
    }
    .section {
      width: 100%;
    }
    .columns {
      display: flex;
      flex-wrap: wrap;
    }
    .column {
      flex: 1;
      min-width: 200px;
    }
    img {
      max-width: 100%;
      height: auto;
    }
    @media only screen and (max-width: 600px) {
      .column {
        width: 100% !important;
      }
    }
  </style>
</head>
<body>
  <div class="email-container">
    ${sections}
  </div>
</body>
</html>
    `.trim();
    }

    private renderSection(section: SectionSchema): string {
        const styles = this.buildStyles({
            backgroundColor: section.backgroundColor,
            padding: section.padding,
        });

        const columns = section.columns.map(column => this.renderColumn(column)).join('\n');

        return `
<div class="section" style="${styles}">
  <div class="columns">
    ${columns}
  </div>
</div>
    `.trim();
    }

    private renderColumn(column: ColumnSchema): string {
        const styles = this.buildStyles({
            width: column.width,
        });

        const blocks = column.blocks.map(block => this.renderBlock(block)).join('\n');

        return `
<div class="column" style="${styles}">
  ${blocks}
</div>
    `.trim();
    }

    private renderBlock(block: BlockSchema): string {
        const styles = this.buildStyles(block.styles);

        switch (block.type) {
            case 'text':
                return `<div style="${styles}">${block.content || ''}</div>`;

            case 'image':
                return `<img src="${block.src || ''}" alt="${block.alt || ''}" style="${styles}" />`;

            case 'button':
                return `<a href="${block.href || '#'}" style="${styles}; display: inline-block; text-decoration: none;">${block.content || 'Button'}</a>`;

            case 'divider':
                return `<hr style="${styles}; border: none; border-top: 1px solid #ddd;" />`;

            case 'html':
                return block.content || '';

            default:
                return '';
        }
    }

    private buildStyles(styles?: Record<string, string | undefined>): string {
        if (!styles) return '';

        return Object.entries(styles)
            .filter(([_, value]) => value !== undefined)
            .map(([key, value]) => {
                const cssKey = key.replace(/([A-Z])/g, '-$1').toLowerCase();
                return `${cssKey}: ${value}`;
            })
            .join('; ');
    }
}
