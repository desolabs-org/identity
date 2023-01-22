# Identity

DeSo Identity Service adapted by the DeSoLabs community
=======

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

After proper configuration of `environment.ts` and `environment.prod.ts`, run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Format

Formatting will happen upon commit. Developers can also run `npm run format` or `npx npm run format` if npm isn't installed to format all source files

# Local development setup

1. Clone the repo, install dependencies and run at localhost:
```
git clone git@github.com:desolabs-org/frontend.git
cd frontend
npm install
npm start -- --disable-host-check
```

2. Get a SSL cert for `*.dev.desolabs.org`:
```
genpkey -out dev-desolabs.key -algorithm RSA -pkeyopt rsa_keygen_bits:2048
openssl req -new -key dev-desolabs.key -out dev-desolabs.csr
openssl x509 -req -days 3650 -in dev-desolabs.csr -signkey dev-desolabs.key -out dev-desolabs.crt
```

3. Get a local proxy providing ssl `https://frontend.dev.desolabs.org`
* Nginx configuration example
```
upstream desolabs_frontend {
    server localhost:4200;
}

server {
    listen 443 ssl;
    listen [::]:443 ssl;

    ssl_certificate ssl-local/dev.desolabs.org/dev-desolabs.crt;
    ssl_certificate_key ssl-local/dev.desolabs.org/dev-desolabs.key;

    server_name frontend.dev.desolabs.org;

    try_files $uri /index.html =404;

    location / {
        proxy_pass http://desolabs_frontend;
    }
}
```

4. Update `/etc/hosts` with `127.0.0.1 frontend.dev.desolabs.org`

5. Accept the self-signed certificate in browser