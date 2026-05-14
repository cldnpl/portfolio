

## Project info

## Deployment

This portfolio is static after build. There is no backend API and the app data/content lives in the frontend source files and local assets under `public/`.

## Open locally without a dev server

Use the already-built local version in:

```sh
dist/local/index.html
```

Open that file in your browser. You do not need to run `npm install` or `npm run dev` just to view the site.

If you edit the source code later and want to refresh the local copy, run only:

```sh
npm run build:local
```

Then open `dist/local/index.html` again.

Build the deployable site with:

```sh
npm run build
```

Deploy the folder:

```sh
dist/client
```

The `server.js` file is only an optional local/SSR preview server. You do not need to run it in production if your host can serve static files such as Netlify, Vercel static output, GitHub Pages, Cloudflare Pages, or any static web host.

This repo also includes `.github/workflows/deploy-pages.yml`: every push to `main` automatically builds the static site and publishes `dist/client` to GitHub Pages. Visitors only open the site URL; they never run any command.

For Vercel, the repository includes `vercel.json` with:

- Build Command: `npm run build`
- Output Directory: `dist/client`

## How can I edit this code?

There are several ways of editing your application.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS
