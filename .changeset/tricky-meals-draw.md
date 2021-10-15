---
"@karrotmarket/design-token": major
"@karrotmarket/react-emotion-theme": major
"@karrotmarket/react-theming": major
"@karrotmarket/styled-components-theme": major
---

Prepare first major release

- Switch to esbuild based bundle, reduce boilerplate
- Make ESM first, support CommonJS conditionally
- Drop AMD, use ES Module instead
- Drop legacy bundler support (Parcel 1, Webpack 4, CRA 4)
  - Resolver should supports Node.js conditional export resolution
