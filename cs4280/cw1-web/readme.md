```
cw1-web
├─ node_modules 
├─ routes /* all routes */
│  ├─ del.js /* delete request */
│  ├─ dir.js /* dir request */
│  ├─ new.js /* new request */
│  ├─ rename.js /* rename request */
│  └─ upload.js /* upload request */
├─ share /* root folder of the File Explorer */
├─ src /* client side javascript and stylesheet */
├─ tempfile /* folder for storing temp file uploaded by multer */
├─ .gitignore
├─ app.js /* entry point of the express app */
├─ package-lock.json
├─ package.json
├─ readme.md
├─ render.js /* module for rendering DOM */
└─ util.js /* module for providing some frequently used function and constant */

1. npm install -> to install node modules
2. npm start / node app.js -> to run the app
3. visit http://127.0.0.1:3000/share
```
