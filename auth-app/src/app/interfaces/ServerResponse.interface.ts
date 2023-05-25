export interface ServerResponse<T = any> {
  ok:    boolean;
  data:  T;
  token?: string | null;
}
