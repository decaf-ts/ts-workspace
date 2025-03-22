export interface OutputWriter {
  data(chunk: any): void
  error(chunk: any): void;
  errors(err: Error): void;
  exit(code: number): void;
}