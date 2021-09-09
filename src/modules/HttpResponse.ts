export class HttpResponse<T> {
    data: T;
    statusCode: number = 200;
    message: string = "Success";
}