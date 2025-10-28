# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is currently not compatible with SWC. See [this issue](https://github.com/vitejs/vite-plugin-react/issues/428) for tracking the progress.

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
# schoolem-intro


# Getting started
To begin clone the repository into a native repo folder or into your desired IDE. 
"git clone ..."

After that go ahead and run to install all needed dependancies.
"npm i"

Jump onto your OWN branch 
"git checkout -b "branch_Name"

Ensure you have all recent changes
"git fetch main" - checks upstream changes and commits before merging into local
"git pull"  - pulls and merges all recent repository commits to local branch

Start changing stuff and ensure to communicate with the team

Push your changes 
"git add (THE FILES YOU WISH TO PUSH)" (**NEVER PUSH ENV OR SENSITIVE VARIABLES**)

you can run "git status" to check the status of your staged changes

to write a commit message and push your changes to github 
"git commit -m "(The message you wish to put)"
"git push origin branch-name"

Finally go to github and confirm your PR and merge your changes 
 *It is always good practice to show your changes to one of the team members*


If you need to go ahead and jump back onto main and run the merge command 
"git merge branch-name"
"git push"


