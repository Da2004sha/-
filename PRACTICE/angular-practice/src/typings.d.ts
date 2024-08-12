declare module 'mammoth' {
  export interface ConvertResult {
    value: string;
    messages: any[];
  }

  export interface ConvertOptions {
    arrayBuffer: ArrayBuffer;
  }

  export function convertToHtml(options: ConvertOptions): Promise<ConvertResult>;
}
