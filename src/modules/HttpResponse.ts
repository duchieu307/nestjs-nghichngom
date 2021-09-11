export class HttpResponse<T> {
  data: T;
  statusCode = 200;
  message = 'Success';
}
