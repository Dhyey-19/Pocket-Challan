# Pocket Challan

Local-first challan and material tracking app with a Node/Express backend and a SQLite database. Runs on localhost and can be packaged for client machines or Windows.

## Features

- Party and item masters
- Challan sales, material in/out, and payments
- Reports and printable outputs
- Backup and restore
- User management and machine-bound registration

## Tech stack

- Node.js + Express
- SQLite via sqlite3
- React 18 (CDN) with a bundled client script
- esbuild for bundling, bytenode for bytecode packaging, pkg for Windows executable builds

## Quick start (local)

1. Install dependencies: `npm install`
2. Build the client bundle: `npm run build:public`
3. Start the server: `npm start`
4. Open http://localhost:3000

The server auto-opens a browser unless `NO_BROWSER=1` is set.

## Registration and login

- On first launch the app shows a registration code and expects a numeric key.
- Registration is tied to the current machine. If the machine fingerprint changes, the app will require re-registration.
- Default admin credentials: username `admin`, password `password`.

## Configuration

- `PORT`: Change the server port (default 3000).
- `NO_BROWSER=1`: Disable auto-opening the browser.
- `APP_MACHINE_SALT`: Salt for the machine fingerprint. Set this before first registration and keep it stable across runs.

App metadata such as version, expiry, and menu labels live in [public/app/constants.js](public/app/constants.js).

## Data storage

The SQLite database file is created in a data directory under the server working directory. In development it lives under [data](data).

## Backup and restore

- GET `/api/backup` downloads the database file.
- PUT `/api/backup/restore` accepts a raw database file (Content-Type `application/octet-stream`). After a successful restore the server exits and should be restarted.

## Scripts

- `npm start`: Run the server from [server.js](server.js).
- `npm run build:public`: Bundle the client from [public/app](public/app) and [public/app.js](public/app.js) into [public/app.bundle.js](public/app.bundle.js).
- `npm run build:client`: Create a client package with Node runtime and bytecode-compiled server.
- `npm run build:win`: Create a Windows executable and copy the required sqlite3 native binding.

## Packaging notes

- Client package builds a self-contained folder (with `node.exe`) and zips it for distribution.
- Windows build uses pkg and copies the sqlite3 binding into the output folder so the executable can run locally.

## Project structure

- [server](server): API routes, repositories, and database setup
- [public](public): Web client assets
- [scripts](scripts): Build and packaging scripts
- [client/PocketChallan](client/PocketChallan): Client-side native sqlite binding and data used by packaged builds

## Utility scripts

- `node scripts/inspect-balance.js "Party Name" "Item Name"` prints material in/out balance details for debugging.
