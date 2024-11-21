# Lantern Tabletop API

An experimental standalone API backend for the [Lantern](https://github.com/owl-factory/lantern) VTT built on [ElysiaJs](https://elysiajs.com) and [Bun](https://bun.sh).

## Requirements

This only requirement to run this project is a [Bun](https://nodejs.org/en) v1.1.34+ environment.

## Getting Started

Getting started with running the project in development mode is very straightforward.

First, clone the project from the remote. Next, in a terminal at the root of the project run `bun install` to install all dependencies.

Lastly, running the command `bun run dev` should run database migrations to create the initial SQLite database and start the dev server.

## Building

The project can be built with `bun run build` (as long as all dependencies are installed). Run the built with `bun run start`. You will need a `.env.prod` file with all of the correct enviornment fields to run a production build. The `.env.dev` file can be used as a referance.

## Testing

Testing not yet implemented.

## Built With

- TypeScript
- Bun
- ElysiaJS
- SQLite
- Kysely

# Author

- **Lucy Awrey** - [lucyawrey](https://github.com/lucyawrey)
