# swoo.by

Tiny url provider for swooby.com

Examples:
* http://swoo.by/meet
* http://swoo.by/resume
* http://swoo.by/pv/cv
* http://swoo.by/pv/resume

More defined at:
* [./functions/redirects.js](./functions/redirects.js)

## Development

For v1 I tried to get Firebase Functions Python code to work, but I ran into and got slowed down by issues.
1. https://github.com/firebase/firebase-tools/issues/8336 prevents using Python > 3.12.  
    WORKAROUND: Install Python 3.12 and:
    ```
    sudo ln -s /opt/homebrew/bin/python3.12 /usr/local/bin/python3.12
    ```
2. Python Flask was not a drop in replacement for JavaScript Express;  
   I could not get it to work identical to JavaScript Express.

So, for v1 I am using raw JavaScript.

For v2 I may refactor to either TypeScript or Python.

### Create Firebase Project

1. Install Firebase CLI:  
   https://firebase.google.com/docs/cli#install_the_firebase_cli
    ```
    npm install -g firebase-tools
    firebase login
    ```
2. Init Firebase Project
    ```
    firebase init
    ```
    swoo-by  
    functions hosting emulator  
    JavaScript (one day TypeScript or Python again)  
    public directory: "hosting"  
    ...

### Initialize Functions

#### JavaScript/TypeScript
```
pushd functions
npm init
popd
```
#### Python
```
pushd functions
python3.12 -m venv venv
source venv/bin/activate
python3.12 -m pip install --upgrade pip
python3.12 -m pip install -r requirements.txt
deactivate
popd
```

### Update Dependencies

#### JavaScript/TypeScript
Ordinarily, this should work:
```
npm install -g npm-check-updates
ncu
ncu -u
npm update --save
```

But, weird situation npm thinks latest `express` is `4.21.2`,
even though `5.0.1` is released:
* https://github.com/expressjs/express/releases/tag/5.0.1
* https://expressjs.com/en/5x/api.html
* https://expressjs.com/en/guide/migrating-5.html
* https://www.npmjs.com/package/express **SHOWS `4.21.2`!!!**
* https://github.com/expressjs/express/releases  
   Yes, `4.21.2` is **newer** than `5.0.1`, but the **latest** should be `5.0.1`!
```
% cat package.json | grep express
    "express": "^4.21.2",
% npm outdated
% ncu
Checking /Users/pv/Dev/GitHub/swooby/swoo.by/functions/package.json
[====================] 6/6 100%
All dependencies match the latest package versions :)
% npm install "express@^5.0.1"
...
% cat package.json | grep express
    "express": "^5.0.1",
% npm outdated
Package  Current  Wanted  Latest  Location              Depended by
express    5.0.1   5.0.1  4.21.2  node_modules/express  functions
```

At least `ncu -u` does not downgrade express from `5.0.1` to `4.21.2`!

#### Python
TBD...

### Debug
```
firebase emulators:start
```

### Add Dependencies

#### JavaScript/TypeScript `package.json`
```
pushd functions
```
Edit `package.json` to add dependencies
```
npm i xyz
popd
```
#### Python: `requirements.txt`
```
pushd functions
```
Edit `requirements.txt` to add dependencies
```
source venv/bin/activate
python3.12 -m pip install --upgrade pip
python3.12 -m pip install -r requirements.txt
deactivate
popd
```

## Tests
Try some of the urls defined in [./functions/redirects.js](./functions/redirects.js)
* http://swoo.by/meet
* http://swoo.by/resume
* http://swoo.by/pv/cv
* http://swoo.by/pv/resume

## Deploy

### Automatic
* `hosting` is deployed automatically by GitHub Actions
* `functions` that are `"pinTag": true` are deployed automatically by `hosting`.

GitHub Action Deploying `pinTag`s will fail on default `firebase init` projects.

For more info see:
* https://github.com/paulpv/hello-firebase-host-func/blob/main/README.md#github-deploy-fail-when-pintag-true

### Manual
```
firebase deploy --only functions,hosting
```
