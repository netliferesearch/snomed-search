# Snomed CT search and refset editor

- Connect to Snowstorm, search for Snomed CT concepts and add or remove them from refsets
- Configurable hostnames and refsets

Requirements:

- [Snowstorm server with basic authentication (for making changes)](docs/snowstorm.md)

![](docs/snomed-search-screenshot.png?raw=true)

# Development

## Installation

```bash
yarn install
yarn start
```

### Netlify specific

Instead of `yarn start`, use `netlify dev` after installing the Netlify CLI. This is only necessary to use Netlify Functions.

```bash
yarn global add netlify-cli
netlify dev
```

## Tests

```bash
yarn test
```

## Deploy

```bash
yarn build
```

This tool uses Create React App, and the finished files are created in a folder called `build`. You can copy or deploy these files to a
hosting service of your choosing.

[A Github Action](.github/workflows/release.yml) has been setup to deploy to Netlify automatically.
