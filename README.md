## My favorite places App
### description
This project is implemented on React.js + Node.js(Koa.js). The application uses the [Mapbox API](https://www.mapbox.com/) as a GIS and [Mongo DB](https://www.mongodb.com/) as a database. Application features:
- add locations (including description and rating);
- download a list of locations depending on their location;
- receive information about the added locations and build a route to them.
### start application 
You need to change the settings in the files `/src/data/configExample.js` and `/server/config/configExample.json` according to your data and rename files to `/src/data/config.js` and `/server/config/config.json`.

Example `/src/data/configExample.js`:
```
    export const mapToken = '[MAPBOX_TOKEN]'
    export const apiUrl = '/point',
                delUrl = '/delpoint',
                host = 'http://localhost:8000'
```

Example `/server/config/configExample.json`:
```
    {
        "port": 8000,
        "mongoose": {
            "uri": "[MONGODB_URL]",
            "options": {
                "keepAlive": true,
                "useNewUrlParser": true,
                "useCreateIndex" : true
            }
        },
        "distance": 10000
    }
```