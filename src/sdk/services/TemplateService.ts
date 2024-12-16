export class TemplateService {
  private templatePaths: Map<string, string> = new Map();
  private loadedTemplates: Map<string, string> = new Map();
  private templateContext;

  constructor() {
    this.templateContext = require.context('../../templates', true, /\.html$/);

    this.templateContext.keys().forEach((key) => {
      const templateName = key.replace(/^\.\/(.*)\.html$/, '$1');
      this.templatePaths.set(templateName, key);
    });
  }

  async fetchTemplate(name: string): Promise<DocumentFragment> {
    let content = this.loadedTemplates.get(name);

    if (!content) {
      const templatePath = this.templatePaths.get(name);
      if (!templatePath) {
        throw new Error(`Template ${name} not found`);
      }

      // Use webpack context for dynamic import
      content = await this.templateContext(templatePath);
      this.loadedTemplates.set(name, content);
    }

    const parser = new DOMParser();
    const doc = parser.parseFromString(content, 'text/html');
    const template = doc.querySelector('template');

    if (!template) {
      throw new Error(`No template element found in ${name}`);
    }

    return template.content.cloneNode(true) as DocumentFragment;
  }

  clearCache(name?: string) {
    if (name) {
      this.loadedTemplates.delete(name);
    } else {
      this.loadedTemplates.clear();
    }
  }
}
