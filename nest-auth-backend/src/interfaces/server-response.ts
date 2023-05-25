export interface ClientResponse<T> {
  ok: boolean;
  data: T,
  token?: string
}
