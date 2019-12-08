# Introduction
This is an example project for [**i18next-express-middleware**](https://github.com/i18next/i18next-express-middleware). It uses [**i18next**](https://www.i18next.com) to provide the content in different languages.

The sample consist on a basic Express webpage created and structured following the default Express layout.

The idea is having a web with three pages: Home, Page A and Page B. The language is automatically detected but the user has the option to select it manually.

To make the example more useful and representative of the different functionalities, the content of the pages is translated in two different places:
* The title is translated in the router or controller.
* The content is translated directly in the PUG view.

# Current Errors
1. In the first place, **i18next** is initialized each time a page is loaded.

2. In addition, the following error is provided by **i18next**
```
i18next: languageChanged en
i18next: hasLoadedNamespace: i18n.languages were undefined or empty undefined
i18next::translator: key "index.title" for namespace "translation" for languages "en" won't get resolved as namespace was not yet loaded This means something IS WRONG in your application setup. You access the t function before i18next.init / i18next.loadNamespace / i18next.changeLanguage was done. Wait for the callback or Promise to resolve before accessing it!!!
```

# Run the web
Once downloaded install all NPM modules:
```
npm install
```

Then run the application:
```
npm start
```

Open the following page in your browser:
[http://localhost:3000](http://localhost:3000)


# Description of the project
## Installation
This project was created using the Express initialization command:
```
express i18next-express-middleware-test --view=pug
```

The following packages were added:
```
npm install i18next
npm install i18next-node-fs-backend
npm install i18next-express-middleware
```

## Configuring the App
The following was added to the `app.js` file to load the new modules:
```js
// Localization
var i18next = require("i18next");
var i18back = require('i18next-node-fs-backend');
var i18midd = require("i18next-express-middleware");
```

And **i18next** is initialized in the `app.js` file as:
```js
// Initialize i18next
i18next
  .use(i18back)
  .use(i18midd.LanguageDetector)
  .init({
    debug: true, // To be removed in production
    backend: {
      loadPath: __dirname + '/locales/{{lng}}/{{ns}}.json',
      addPath: __dirname + '/locales/{{lng}}/{{ns}}.missing.json'
    },
    preload: ['en', 'es'],
    fallbackLng: 'en',
    saveMissing: true,
    detection: {
      // Use cookies so the user selected language is kept
      caches: ['cookie'],
      cookieDomain: 'localhost' // => must be a real domain
    }
  });
```

In the same `app.js` file, the middleware is connected just before the routes (so it is not used when getting the views, stylesheets, images...) 
```js
// Use i18next
app.use(i18midd.handle(i18next));
```


## Configuring the routes
The `index.js` router was modified to include these three routes:
```js
/* GET A page. */
router.get('/page-a/', function(req, res, next) {
  res.render('page-a', { title: req.t('page-a.title'), });
});
/* GET B page. */
router.get('/page-b/', function(req, res, next) {
  res.render('page-b', { title: req.t('page-b.title'), });
});
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: req.t('index.title'), });
});
```



## Creating the views
The `layout.pug` was extended to include a navigation menu and buttons to change the language:
```
doctype html
html
  head
    title= title
    link(rel='stylesheet', href='/stylesheets/style.css')
  body
    block content
    hr
    h2 Navigation:
    ul
      li
        a(href='/') Home
      li
        a(href='/page-a/') Page A
      li
        a(href='/page-b/') Page B
    h2 Language selector:
    ul
      li
        a(href='?lng=en') English
      li
        a(href='?lng=es') Spanish
```

And three PUG views were defined:

The home page `index.pug`:
```
extends layout

block content
  h1= title
  p=t('index.content')
```

The A page `page-a.pug`:
```
extends layout

block content
  h1= title
  p=t('page-a.content')
```

The B page `page-b.pug`:
```
extends layout

block content
  h1= title
  p=t('page-b.content')
```


## Creating the translation files
The translation is included in two files:

English is provided in the `locales/en/translation.json` file:
```json
{
  "index": {
    "title"   : "Title of Home page",
    "content" : "Content of the Home page. This was translated directly in the PUG view. The title translated in the router."
  },
  "page-a": {
    "title"   : "Title of A page",
    "content" : "Content of the A page. This was translated directly in the PUG view. The title translated in the router."
  },
  "page-b": {
    "title"   : "Title of B page",
    "content" : "Content of the B page. This was translated directly in the PUG view. The title translated in the router."
  }
}
```

Spanish is provided in the `locales/es/translation.json` file:
```json
{
  "index": {
    "title"   : "Título de la página Home",
    "content" : "Contenido de la página Home. This was translated directly in the PUG view. The title was translated in the router."
  },
  "page-a": {
    "title"   : "Título de la página A",
    "content" : "Contenido de la página A. This was translated directly in the PUG view. The title was translated in the router."
  },
  "page-b": {
    "title"   : "Título de la página B",
    "content" : "Contenido de la página B. This was translated directly in the PUG view. The title was translated in the router."
  }
}
```
