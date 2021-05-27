# auth.interceptor

Usamos httpInterceptor proporcionado por angular (https://angular.io/api/common/http/HttpInterceptor), cual tiene un metodo `intercept()` para insepccionar y trasnformar peticiones HTTP antes de que se envien al servidor.

`intercept()`recibe el objeto HTTPRequest, lo cambia y envia al metodo `handle()` de HttpHandler. Esto trasnforma el HTTPRequest a un `Observable<HttpEvents>`

`next: HttpHandler object` represente el proximo interceptor en la cadena de interceptores. El ultimo `next` es el cliente HttpClient de Angular (https://angular.io/guide/http)
