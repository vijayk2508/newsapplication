import { loginReducer } from "./login/loginReducer";
import { newsReducer } from "./news/newsReducer";
import { userManagementReducer } from "./userManagement/userManagementReducer";

export default {
 login: loginReducer,
 news: newsReducer,
 userManagement: userManagementReducer
};
