const reducerTemplate = reducerName =>
  `import produce from "immer";
import ${reducerName}Constants from "./${reducerName}Constants";

const initialState = {
  // Keep your initial state object for ${reducerName} here \n
};;

export const ${reducerName}Reducer = produce((state, action) => {
  // Don't return anything from here
  // Just make changes in the state object and add a break in the end for each case.
  // Immer's produce will automatically return the state object.
  // Refer to https://immerjs.github.io/immer/docs/introduction for more information

  switch (action.type) {
    default: // Adding default due to es-lint
  }
}, initialState);`;

module.exports = reducerTemplate;
