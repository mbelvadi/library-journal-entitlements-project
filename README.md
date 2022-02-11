# UPEI Library Journal Project

Dreamteam unite :)

## Dev Section

### Branch naming

When branching off use the following format to name your branch: `FIRST_NAME_INTIAL/branch-task`. So if I (Cal) was working on adding a search endpoint, I would create a branch called `C/search-endpoint`

### Prettier

Prettier is a code formatter that works with most frontend languages. It is used to keep the look of code consistent across multiple developers. To install prettier and get it working in your local environment see the following steps (assuming your using VSCode):

1. Install [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) from the VSCode extensions marketplace.

2. Add the following to your VSCode settings file:

   ```json
   "editor.defaultFormatter": "esbenp.prettier-vscode",
   "prettier.requireConfig": true,
   ```

3. Optionally add the following to your VSCode settings file if you prefer to only format on save:
   ```json
     "editor.formatOnSave": true,
   ```

Prettier should now be formatting your code! Note in the root of the project your will find a `.prettierrc` file. This is the config file prettier will use to style the code in this project.
