// TemplateService.ts
export class TemplateService {
  private templates: Map<string, string> = new Map();

  constructor() {
    const templateContext = require.context(
      '../../templates',
      false,
      /\.html$/
    );

    templateContext.keys().forEach((key) => {
      const templateName = key.replace(/^\.\/(.*)\.html$/, '$1');
      // Get template content directly
      const content = templateContext(key);

      if (typeof content !== 'string') {
        console.error('Invalid template content:', {
          templateName,
          contentType: typeof content,
          content,
        });
        return;
      }

      this.templates.set(templateName, content);
    });
  }

  async fetchTemplate(name: string): Promise<DocumentFragment> {
    const content = this.templates.get(name);
    if (!content) {
      throw new Error(`Template ${name} not found`);
    }

    const parser = new DOMParser();
    const doc = parser.parseFromString(content, 'text/html');
    const template = doc.querySelector('template');

    if (!template) {
      throw new Error(`No template element found in ${name}`);
    }

    // Return cloned content to prevent recursion
    return template.content.cloneNode(true) as DocumentFragment;
  }
}
