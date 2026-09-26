# devpilotX

[![CI and deploy](https://github.com/devpilotX/devpilotX/actions/workflows/deploy.yml/badge.svg)](https://github.com/devpilotX/devpilotX/actions/workflows/deploy.yml)
[![Website](https://img.shields.io/website?url=https%3A%2F%2Fdevpilotx.github.io%2FdevpilotX%2F&label=website)](https://devpilotx.github.io/devpilotX/)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](./LICENSE)

Source code for my personal site, live at **[devpilotx.github.io/devpilotX](https://devpilotx.github.io/devpilotX/)**.

Hi, I'm Dipanshu. I'm a full-stack developer from India and I'm currently building my own SaaS under the name DevPilotX. I work mostly with Python, Node.js, TypeScript and Docker, and I host my projects on AWS EC2 and Oracle Cloud machines.

- LinkedIn: [dipanshu03j](https://www.linkedin.com/in/dipanshu03j)
- X: [@devpilotx](https://x.com/devpilotx)
- Instagram: [@devpilotx](https://www.instagram.com/devpilotx)
- Email: connect.dipanshukumar@gmail.com

## Stack

- [Next.js 16](https://nextjs.org) (App Router) exported as a static site
- [Tailwind CSS v4](https://tailwindcss.com), [shadcn/ui](https://ui.shadcn.com) and [Magic UI](https://magicui.design)
- [Motion](https://motion.dev) for animations
- [Content Collections](https://www.content-collections.dev) for the MDX blog
- GitHub Actions and GitHub Pages for CI and hosting

## Running it locally

You need Node.js 20.9 or newer and pnpm.

```bash
git clone https://github.com/devpilotX/devpilotX.git
cd devpilotX
pnpm install
pnpm dev
```

Then open http://localhost:3000.

| Command          | What it does                                  |
| ---------------- | --------------------------------------------- |
| `pnpm dev`       | Starts the dev server with hot reload         |
| `pnpm build`     | Builds the static site into `out/`            |
| `pnpm start`     | Serves the built `out/` folder on port 4173   |
| `pnpm lint`      | Runs ESLint                                   |
| `pnpm typecheck` | Runs the TypeScript compiler (after a build)  |

## Editing content

- **Profile, projects, education and links** are all in [`src/data/resume.tsx`](./src/data/resume.tsx).
- **Blog posts** are MDX files in [`content/`](./content). Each one needs `title`, `publishedAt` and `summary` in its front matter.
- **Profile photo and logos** are in [`public/`](./public).

## Deployment

Every push to `main` runs [`.github/workflows/deploy.yml`](./.github/workflows/deploy.yml). It lints, builds and type checks the site, then publishes the `out/` folder to GitHub Pages. Pull requests run the same checks without deploying.

The build reads its base path from the repository's Pages settings through `actions/configure-pages`, so it works under `/devpilotX` on github.io today. To move it to a custom domain such as devpilotx.me, add the domain under **Settings → Pages** and push again. No code changes are needed.

## Credits

The design is based on the open source [portfolio template by Dillion Verma](https://github.com/magicuidesign/portfolio). Both the template and this repo are released under the [MIT license](./LICENSE).
