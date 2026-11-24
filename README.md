# <a href="https://stivendz.github.io/CV-/">CV Stiven Diaz</a>


## Run locally

```
npm install
npm start          # http://localhost:5500
npm run watch-sass # recompile styles while editing src/sass
```

## Query params

All optional and combinable, e.g. `?lang=es&compact=true&jobs=efletexia,neutica`

| Param | Values | Effect |
| --- | --- | --- |
| `lang` | `es` \| `en` | Language (default: browser language) |
| `sls` | `false` | Hide the language switch |
| `abb` | `true` | Solid black header background |
| `pdf` | `true` | PDF mode: no toolbar, no animations |
| `compact` | `true` | Short version: hides the summary list and hobbies, max 2 bullets per project |
| `hide` | `skills,languages,hobbies,contact,profile,summary,keyskills,education,experience` | Hide sections |
| `jobs` | `efletexia,neutica,mqa,asi` | Only show these jobs |
| `projects` | number | Max projects per job |
| `tasks` | number | Max bullets per project |

The **Descargar PDF / Download PDF** button downloads `CV-Stiven-Diaz-<lang>.pdf`. When filters are active it opens the print dialog instead, so the PDF matches what you see.

## PDF

```
npm run pdf                                    # CV-Stiven-Diaz-es.pdf + CV-Stiven-Diaz-en.pdf
npm run pdf -- --lang=es                       # only Spanish
npm run pdf -- --query="compact=true" --name=CV-Short
npm run pdf -- --query="jobs=efletexia,neutica&hide=hobbies,education" --name=CV-AI
```

Uses the installed Chrome or Edge (override with `CHROME_PATH`). Regenerate the PDFs after editing the JSON so the download button serves the latest version.
