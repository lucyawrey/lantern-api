# Lantern Tabletop

An experimental backend for the [Lantern](https://github.com/owl-factory/lantern) VTT built on [ElysiaJs](https://elysiajs.com) and [Bun](https://bun.sh).

## Requirements

This only requirement to run this project is a [Bun](https://nodejs.org/en) v1.3.1+ environment.

## Getting Started

First, clone the project from the remote.

Next, in a terminal at the root of the project run `bun install` to install all dependencies.

Lastly, running the command `bun run dev` will run initial database migrations and then start the dev server.

## Building

The project can be built with `bun run build`. The resulting binary can be run directly or with the command `bun run start`. You will need a `.env.prod` file with all of the correct environment fields to run a production build. The `.env.dev` file can be used as a reference.

## Testing

Testing not yet implemented.

## Built With

- TypeScript
- Bun
- ElysiaJS
- SQLite

# Author

- **Lucy Awrey** - [lucyawrey](https://github.com/lucyawrey)
