declare module 'papaparse' {
  interface ParseConfig {
    header?: boolean;
    delimiter?: string;
    skipEmptyLines?: boolean;
  }

  interface ParseResult {
    data: any[];
    errors: any[];
    meta: any;
  }

  export function parse(input: string, config?: ParseConfig): ParseResult;
  export function unparse(data: any[]): string;
}