import produce from "immer";
import newsConstants from "./newsConstants";

const initialState = {
  newsDataArray: [],
  sourceDataArray: []
};

export const newsReducer = produce((state, action) => {
  switch (action.type) {
    case newsConstants.GetResponseFromNewsAPI:
      //  let tempNewsDataArray = state.newsDataArray;
      //  tempNewsDataArray = action.data

      return {
        ...state,
        news: action.data
      }
      break;

    case newsConstants.GetSourceFromNewsAPI:
      return {
        ...state,
        source: action.sourcedata
      }
      break;

    case newsConstants.GetAllBookMarkedNews:
        return {
          ...state,
          bookmarkednews: action.data
        }
        break;

    default: 
    return {
      ...state
    }
    
    break
  }
}, initialState);