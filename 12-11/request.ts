export interface HttpResponse {
  success: Boolean
  responseType: XMLHttpRequestResponseType
  response: any
}

export class HttpRequest {
  public static doGet(url: string): HttpResponse {
    let xhr: XMLHttpRequest = new XMLHttpRequest()
    xhr.open('get', url, false, null, null)
    xhr.send()
    if (xhr.status === 200) {
      return { success: true, responseType: 'text', response: xhr.response }
    } else {
      return { success: false, responseType: 'text', response: null }
    }
  }
  public static doGetAsync(
    url: string,
    callback: (response: HttpResponse) => void,
    responseType: XMLHttpRequestResponseType = 'text'
  ): void {
    let xhr: XMLHttpRequest =  new XMLHttpRequest()
    xhr.responseType = responseType
    xhr.onreadystatechange = (e: Event): void => {
      if (xhr.readyState === 4 && xhr.status === 200) {
        let response: HttpResponse = {
          success: true,
          responseType: responseType,
          response: xhr.response
        }
        callback(response)
      } else {
        callback({
          success: false,
          responseType: responseType,
          response: null
        })
      }
    }
    xhr.open('get', url, true, null, null)
    xhr.send()
  }
}