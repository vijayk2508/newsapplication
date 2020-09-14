
﻿# Boilerplate

This repository is a boilerplate/starter-kit which we can utilise for any project here.
It's a bit opinionated according to the experiences/challenges that we have faced till now regarding development flow and contains some folder structures and pre-installed packages to enforce best practices and better code standards.

## Folder Structure:

```json
my-app/
	README.md
	README.html
	Create-React-App-README.md
	node_modules/
	package.json
	public/
		index.html
		favicon.ico
	src/
		action-reducer/
		apiEndpoints/
		assets/
		common/
		components/
		constants/
		containers/
		custom-hooks/
		helper/
		polyfills/
		routes/
		services/
		store/
		UIComponents/
		main.scss
		serviceWorker.js
	.gitignore
```

### Folder Description:

1.  **action-reducer**: This will contain a folder based on the reducer name, for example:

```json
action-reducer/
 login/
	 loginReducer.js
	 loginConstants.js
	 loginActions.js
```

Finally, it will also contain an `appReducer.js` where you can export all the reducers that you have created till now.

2.  **api-endpoints**: This folder will contain an object which maps all api-endpoint URLs to constant keys.
    Use these keys in any of your network requests.

3.  **assets**: These consists of globally shared sass, images and css.

```json
assets/
	 css
	 img
	 sass
```

4. **common**: Consists of some common utility components.
   Example: `LazyLoad` component which can be used to load any component lazily.
   For more details on `LazyLoad` component, refer the component file.

5. **components**: This is the heart of your code base. It will consist of all the components that you will be developing. Each component **must** have **atleast** the following minimal structure:

   ```json
   	components/
   			Login/
   				index.js
   				optionalFilesOrFolders
   			Register/
   				index.js
   				...
   				...
   			SomeComponent/
   				index.js
   ```

   This structure can be improved upon for sure.

6. **constants**: This folder will consist of all the constants that will be used in the app except reducer based and route based constants.
   A must have file in the folder is `portConstants.js` which will contain the baseURL for all your API requests.

7. **containers**: Containers are **Top-level** components. They can be generally your routes' root/parent component or a parent component to a set of deeply nested or complex components in some cases.

8. **custom-hooks**: This houses any custom hooks that you create and use in your application.

9. **helper**: Any helper functions like a generic `formValidator.js`, etc.

10. **polyfills**: All polyfills that you might need to include in your application. You will probably not need to use it that much. If you are creating a new polyfill, you just need to import it in the index.js of the folder.

    _Polyfill folder_:

    ```json
    	polyfills/
    		...
    		somePolyfill1.js
    		somePolyfill2.js
    		...
    		index.js
    ```

    _polyfills/index.js_ :

    ```json
    	import "./somePolyfill1.js";
    	import "./newPolyfill2.js";
    ```

11) **routes**: This folder consists of a set of file that you do not need to edit. The only change you need to do for adding a route is to just add another `RouteObjectType` in the routeConstants.js.
    ```json
    RouteObjectType = {
    	path: string,
    	exact: oneOf([true, false]),
    	routeComponentParent: oneOf(["containers", "components", "UIComponents", "common"]),
    	routeComponentPath: string,
    	isAuthenticated: oneOf([true, false])
    };
    ```
    Internally, the component will dynamically load all the routes and will also follow route-based code-splitting to load each route only **_on-demand_**.
12) **services**: This folder consists of any _services_ based functionality like network requests to the server. _Services_ based functionalities can be described as the functions which help us to interact with the server ( through `xmlHttpRequests`, `ajax`, `axios`, `fetch` , `sockets`, or any other medium) .
    The folder exports a single function `sendApiRequest`.

_Prototype for sendApiRequest_:

```json
	sendApiRequest(apiParamsObject);
```

_`apiParamsObject` has the following schema:_

```json
	apiParamsSchema  =  struct({
		url: "string",
		method: "string",
		baseURL: "string?",
		transformRequest: "function?",
		transformResponse: "function?",
		headers: "object?",
		params: "object?",
		paramsSerializer: "function?",
		data: "object?",
		timeout: "number?",
		withCredentials: "boolean?",
		adapter: "object?",
		auth: "object?",
		responseType: "object?",
		xsrfCookieName: "string?",
		xsrfHeaderName: "string?",
		onUploadProgress: "function?",
		onDownloadProgress: "function?",
		maxContentLength: "number?",
		validateStatus: "function?",
		maxRedirects: "number?",
		socketPath: "string?",
		httpAgent: "object?",
		httpsAgent: "object?",
		proxy: "object?",
		cancelToken: "object?"
});
```

Any object passed through `sendApiRequest` will be validated with this schema ( **only in development mode** ) and will throw an exception with a suitable message if any wrong param is passed through the function.

13. **store**: The root of redux where the store is initialized.
    Folder structure:

```json
	store/
		index.js
		middleware.js
```

You might need the `middleware.js` for **Global Actions** like restting the whole redux state on logout.
The advantage is that you do not need to add a case for this Global Action in every reducer.
You won't be needing to make any changes in index.js.
Please add any global actions to the function exposed in middleware.js only.

14. **UIComponents**: This folder is the source of our UI Component kit. The target is to add a well thought of and **highly reusable** component library which should be compliant with all **Web/HTML standards and should comply with accessibility properties**.

## Boilerplate Packages

1.  Immer.js - A function that allows you to work with immutable state in a more convenient way.
    **Please note: We must use immer in all our reducers. Previously we were using `lodash.clonedeep` to prevent mutation but that has been removed as it is not so good for performance. So, as we refactor through our previous codes, please add immer to every reducer and remove any occurences of clonedeep.**

```json
import  produce  from  "immer";
import  loginConstants  from  "./loginConstants";
import { cookies } from  "../../services/auth";

const  initialState  = {
	isLoggedIn: !!cookies.get("SID")
};
export const loginReducer = produce((state, action) => {
	switch (action.type) {
		case  loginConstants.LOGIN_SUCCESSFUL:
			state.isLoggedIn = true;
			break;

		case  loginConstants.LOGOUT_SUCCESSFUL:
			state.isLoggedIn = false;
			break;

		default: // for es-lint :(
	}
}, initialState);
```

[ImmerJS Documentation](https://immerjs.github.io/immer/docs/introduction)
[ImmerJS basics tutorial ( 7mins )](https://egghead.io/lessons/redux-simplify-creating-immutable-data-trees-with-immer)

2.  React-router:
    [React-router-documentation](https://reacttraining.com/react-router/)

3.  Connected-react-router:
    [Connected-react-router-documentation](https://github.com/supasate/connected-react-router)
4.  React-router-dom

5.  Redux:
    [Redux website](https://redux.js.org/)
6.  React-redux:
    [React redux website](https://react-redux.js.org/)
7.  Redux-thunk
    [Redux thunk docs](https://github.com/reduxjs/redux-thunk)
8.  Prop-types
    [Prop-types (React.js official website docs)](https://reactjs.org/docs/typechecking-with-proptypes.html)
9.  Styled-components
    [Styled-components official website](https://www.styled-components.com/)
10. Classnames:
    [Classnames docs](https://github.com/JedWatson/classnames)
11. Node-sass
    [Node-sass github](https://github.com/sass/node-sass)
    You do not need to make any changes with node-sass
12. React-cookie
    [React cookie npm page](https://www.npmjs.com/package/react-cookie)

13. Axios ( or any api-request based library )
    [Axios docs](https://github.com/axios/axios)
14. Superstruct / Validate.js/ Joi-browser
    [Superstruct docs](https://github.com/ianstormtaylor/superstruct)
    [Validate.js](https://validatejs.org/)
    [Joi-browser npm](https://www.npmjs.com/package/joi-browser)

You can contribute to the code or this Readme.md if you think it is missing out on anything.
You can also search for : `// To-do:` (with the comments) to update the code.

There are more guidelines that will be given soon so your feedback and suggestions will be much appreciated.

## Automated Templating

  

We have introduced an automated templating which will run whenever you run `npm start`.

  

Please make sure that your `"start"` key in `package.json` -> `"scripts"` has the following value:

```json

...

"scripts": {
	...

	"start": "node app-runner"

	...
}

...

```

  

On running, the template script will check if there is any **Existing** file or directory that needs templating and will apply the proper templates to them.

  

* On creation of a directory in `src/action-reducer`, a common template is created for the 'actions', 'reducer' and 'constants' files following the naming convention as:

```json

src/
	action-reducer/
		[reducerName]/
			[reducerName]Actions.js
			[reducerName]Constants.js
			[reducerName]Reducer.js

```

The `appReducer.js` is automatically updated with the new reducer following the same convention.

  

* On removal of a directory from `src/action-reducer`, the `appReducer.js` is updated accordingly.

  

Hence, there is no need to create/edit `appReducer.js` at any moment by yourself.

  

* On creation of a directory in `src/components` or `src/containers` or `src/common` or `src/UIComponents`, a common template is created for the 'index.js' file following the naming convention as:

```json

src/
   [components|containers|common|UIComponents]/
									[ComponentName]/
												index.js

```

  

Please make the directory name's first letter as Capitalized as it will be the Component's name in your `index.js`.

  

For example,

  

For a directory `src/components/Login`, the template will be:

```json

import React from "react";

function Login(props) {

	return  (
		<h1>Login</h1>
	);

}

export default Login;

```

  

Notice the use of the directory name as the component's name.

  

* On creation of any `.scss` or `.sass` files, a default template will be added to that `.scss` or `.sass` which will import all the defaults that must be imported in order to use the global/shared SASS assets properly.

  

Three `dev-dependencies` have been added for templating flow. You do not need to worry about these dependencies sneaking in to your production as they are (as the name says) **only for development**. You can go through the docs of the added dependencies if you want to contribute:

  

1. Chalk: [Chalk Documentation](https://github.com/chalk/chalk)

2. Concurrently: [Concurrently Documentation](https://github.com/kimmobrunfeldt/concurrently)

3. Chokidar: [https://github.com/paulmillr/chokidar](Chokidar Documentation)

4. Cross-env: [https://github.com/kentcdodds/cross-env](Cross-env Documentation)

5. React-dev-utils: [https://github.com/facebook/create-react-app/tree/master/packages/react-dev-utils](React-dev-utils Documentation)

* Removed `detect-port-alt` but can be useful later.
