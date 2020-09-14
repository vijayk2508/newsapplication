/*
This function applies any middleware action like resetting the state,
i.e, actions that will apply to the whole state.

*/

const middlewareReducer = reducer => (state, action) => {
  // if (action.type === globalReducerConstants.RESET_STATE) {
  //   state = {
  //     router: state.router
  //   };
  // }
  return reducer(state, action);
};

export { middlewareReducer };
