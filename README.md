# TinyApp
As an avid twitter poster, I want to be able to shorten links so that I can fit more non-link text in my tweets.
The Tiny URL generated using this app is a random string of length 6.

## Instalation

```
  node -v
  v7.7.2
```
  Run `npm install` to install the dependencies.
  
  command to run server is `node express_server.js`
  
  * When I visit http://localhost:8080/ it redirects me to registration page.
  
  ![registeration](https://github.com/sindhupriya-madala/TinyApp/blob/master/views/images/register.jpg)
  
  * After Registration it opens the url's index page.
  
  ![index](https://github.com/sindhupriya-madala/TinyApp/blob/master/views/images/urls-index.jpg)
  
  * If yoou click on Create Short URL Link it redirects to new URL page.
  
  ![new URL](https://github.com/sindhupriya-madala/TinyApp/blob/master/views/images/new-url.jpg)
  
  * If you click Edit option for a URL in Index page you can edit your long URL.
  
  ![edit URL](https://github.com/sindhupriya-madala/TinyApp/blob/master/views/images/edit-url.jpg)
  
  As a twitter reader, I want to be able to visit sites via shortened links, so that I can read interesting content.

  * When I visit a short link Then I am redirected to the page corresponding to the short URL's original URL.
  
