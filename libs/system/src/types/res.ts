// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface T {}

export interface Res<T> {
  code: number;
  data?: T;
  error?: string | { field: string; message: string }[];
  message?: string;
}
