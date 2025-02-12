import { provideHttpClient } from '@angular/common/http';
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHighlightOptions } from 'ngx-highlightjs';
import { appRoutes } from './app.routes';


export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(appRoutes),
    provideHttpClient(),
    provideHighlightOptions({
      coreLibraryLoader: () => import('highlight.js/lib/core'),
      lineNumbersLoader: () => import('ngx-highlightjs/line-numbers'), // Optional, add line numbers if needed
      languages: {
        bash: () => import('highlight.js/lib/languages/bash'),
        c: () => import('highlight.js/lib/languages/c'),
        cpp: () => import('highlight.js/lib/languages/cpp'),
        css: () => import('highlight.js/lib/languages/css'),
        csharp: () => import('highlight.js/lib/languages/csharp'),
        diff: () => import('highlight.js/lib/languages/diff'),
        go: () => import('highlight.js/lib/languages/go'),
        graphql: () => import('highlight.js/lib/languages/graphql'),
        java: () => import('highlight.js/lib/languages/java'),
        javascript: () => import('highlight.js/lib/languages/javascript'),
        json: () => import('highlight.js/lib/languages/json'),
        kotlin: () => import('highlight.js/lib/languages/kotlin'),
        less: () => import('highlight.js/lib/languages/less'),
        makefile: () => import('highlight.js/lib/languages/makefile'),
        markdown: () => import('highlight.js/lib/languages/markdown'),
        objectivec: () => import('highlight.js/lib/languages/objectivec'),
        perl: () => import('highlight.js/lib/languages/perl'),
        php: () => import('highlight.js/lib/languages/php'),
        python: () => import('highlight.js/lib/languages/python'),
        r: () => import('highlight.js/lib/languages/r'),
        ruby: () => import('highlight.js/lib/languages/ruby'),
        rust: () => import('highlight.js/lib/languages/rust'),
        scss: () => import('highlight.js/lib/languages/scss'),
        shell: () => import('highlight.js/lib/languages/shell'),
        sql: () => import('highlight.js/lib/languages/sql'),
        swift: () => import('highlight.js/lib/languages/swift'),
        typescript: () => import('highlight.js/lib/languages/typescript'),
        vbnet: () => import('highlight.js/lib/languages/vbnet'),
        wasm: () => import('highlight.js/lib/languages/wasm'),
        xml: () => import('highlight.js/lib/languages/xml'),
        yaml: () => import('highlight.js/lib/languages/yaml'),
      },
    })
  ],
};
