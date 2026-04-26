//===============================BRANCH2=======================

#DEVTINDER
-create vite@latest DEV_CONNECT
-remove all unnecessary code and create a hello world heading
-Install tailwindcss and postcss
-Install DaisyUI => npm i -D daisyui@latest
-add basic components
-Add Routes => install react-router-dom
Create BrowserRouter > Routes >Route=/ BOdy >RouteChildren
Create an Outlet in your body component
Create a footer

npm i axios to connect to API of backend
npm i cors => to install cors plugin in backend => add middleware to with configurations: origin, credentials :true
setup cors plugin at the backend
--Whenever You are making API call so pass axios=> {withCredentials:true} ---> To store the cookie in the browser and later on secure acess of API based on roles

//REDUX STORE
npm install @reduxjs/toolkit react-redux --https://redux-toolkit.js.org/tutorials/quick-start
create a redux-toolkit store
configureStore => Provider => createSlice =>add reducer to Store
-Add redux devtools in chrome
-Login and see if your data is configured properly in store or not
-NavBar should update as soon as user Logs in
-Refactor our code to add constant file , create a component folder and move all components to it.

//LOGIN SYSTEM
-create signup component
-create login component
you should not acess other routes without login
-Handle form validation on logout
-Handle Form validation on signup;

//USERCARD
-build Usercard
-show feed
-- pass store.user (userdata) as props to EDIT PROFILE while will be used for EDIT PROFILE

//EDITCARD
-build editcard page with same as signup form with useState to show their live data on profile form and GET USER CARD

//CONNECTION CARD
-create a connectionSlice
-use .map to loop over each connection and use card to show data;

//REQUEST CARD
--see all my incoming connection request
--add buttons to accept or reject the request

Body
Navbar
Route=/ => Feed
Route/login => login
Route=/connections => Connections
Route=/profile => Profile
t
