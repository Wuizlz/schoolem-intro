# React + Vite (For devs)

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler (For devs)

The React Compiler is currently not compatible with SWC. See [this issue](https://github.com/vitejs/vite-plugin-react/issues/428) for tracking the progress.

## Expanding the ESLint configuration (For devs)

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

# schoolem-intro

# Getting started
To begin clone the repository into a native repo folder or into your desired IDE. 
"git clone ..." (USE HTTP)

After that go ahead and run to install all needed dependancies.
"npm i"

0) Start on main and get the latest code
    git checkout main 
    → move to the local main branch.

    git fetch origin 
    → download the latest branch pointers from GitHub (no file changes yet).

    git pull --ff-only origin main 
    → update local main to match GitHub using a fast-forward only update (prevents accidental merge commits on main).

## Running the project 
0.5) To run and initialize the project:
    a) Ensure that you have run a git fetch/pull to bring the latest changes to your local machine
    b) Run *npm i* to install the latest dependencies
    c) Finally, run *npm run dev* to run the project on your local host. The local host link will be visible in your terminal

## Dev Work (For the people who work on this project)
1) Create and switch to your feature branch
    git checkout -b <branch-name>
    → -b creates a new branch
    → Use a clear name, e.g. login-divider or signup-first-last.
   git checkout <branch-name>

   
3) Make your code changes
    git status
    → see what changed and what’s staged.

    git add -A
    → stage all changes (new/modified/deleted).

    git commit -m "feat(signin): bold divider; feat(signup): split full name"
    → save a snapshot locally.

4) Push the branch to GitHub (first time)
    git push -u origin HEAD
    → Pushes the current branch to origin and remembers it (so future pushes can be just git push).
    → HEAD is a shortcut for “the branch I’m on.”
 
5) Open a Pull Request (PR) to main
    On GitHub UI, click “Compare & pull request.”

6) Address review feedback (if any)
    git add -A
    → stage all changes

    git commit -m "fix: adjust divider thickness"
    → record a snapshot of staged changes.

    git push

7) Merge the PR
    → On GitHub, click “Squash and merge” (recommended).
    → Produces a single clean commit on main with a helpful message.
    → Alternatives: “Merge commit” (keeps all commits) or “Rebase & merge” (linear, preserves commits).

8) Go back to main locally and update it
    git switch main
    git pull --ff-only origin main


9) Clean up the merged branch (remote + local)
    git push origin --delete krish/<short-topic>
    → delete the branch on GitHub.

    git branch -d krish/<short-topic>
    → delete a local branch that’s already merged.

    git fetch --prune
    → remove local refs to remote branches that no longer exist.

10) Repeat for the next change/feature
    git switch -c krish/<next-topic>

