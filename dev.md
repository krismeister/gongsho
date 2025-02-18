This product is still in early development. But you can try it out running in development mode.

Copy the `.env` file.

```
cp .env.example .env
```

Add an anthropic api key to the `.env` file.

Start the API and UI:

```
npm run start:api
npm run start:ui
```

Open the web interface at `http://localhost:3030`

# show project dependencies

```
npx nx dep-graph

npx nx show project ui
```

# generate new node library

```
npx nx g @nx/node:library libs/text-to-blocks --dry-run
```

# generate a nest controller

```
npx nx g @nx/nest:controller apps/api/src/app/foo.controller.ts

npx nx g @nx/nest:service apps/api/src/app/conversations.service.ts
```

Angular generators:

```

npx nx g @nx/angular:component apps/ui/src/app/spartan-component.ts

```

One-time setup tailwind:

```
npx nx g @nx/angular:setup-tailwind
```

Angular Spartan

```

npx nx g @spartan-ng/cli:healthcheck
```

Theme:

```
npx nx g @spartan-ng/cli:ui-theme
```

Re-install components:

```
npx nx g @spartan-ng/cli:ui
```

lint a project:

```
npx eslint --debug apps/ui/eslint.config.mjs
npx @eslint/migrate-config apps/ui/eslint.config.mjs
```

Running jest natively:

```
npx jest --config libs/text-to-blocks/jest.config.ts libs/text-to-blocks
```

### Updating Packages:

```
npx nx migrate latest --interactive

npx nx migrate --run-migrations --if-exists

```

** NOTE** we had to install an old version of @nestjs/serve-static.

```
npm install @nestjs/serve-static@10.4.15
```

Because the latest version needs a newer nestjs than nx supports.
