### Development

To start the project locally, run:

```bash
npm start
```

Open `http://localhost:8000` with your browser to see the result.

## Documentation

### Requirements

- Node.js >= 14.17
### Scripts

- `npm start` — Starts the application in development mode at `http://localhost:8000`.
- `npm build` — Compile your application and make it ready for deployment.
- `npm serve` — Serve the production build of your site
- `npm clean` — Wipe out the cache (`.cache` folder).
- `npm type-check` — Validate code using TypeScript compiler.
- `npm lint` — Runs ESLint for all files in the `src` directory.
- `npm format` — Runs Prettier for all files in the `src` directory.
- `npm commit` — Run commitizen. Alternative to `git commit`.
- `npm test` — Run tests.

### Path Mapping

TypeScript are pre-configured with custom path mappings. To import components or files, use the `@` prefix.
