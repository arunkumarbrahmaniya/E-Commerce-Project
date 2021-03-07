import React, {useEffect} from 'react';
import { Switch, Route } from 'react-router-dom';
import Login from './pages/auth/Login';
import Home from './pages/Home';
import Register from './pages/auth/Register';
import Header from './components/nav/Header';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'
import RegisterComplete from './pages/auth/RegisterComplete';
import { auth } from './firebase';
import { useDispatch } from 'react-redux';
import ForgotPassword from './pages/auth/ForgotPassword';
import { currentUser } from './functions/auth';
import History from './pages/user/History';
import Password from './pages/user/Password';
import Wishlist from './pages/user/Wishlist';
import UserRoute  from './components/routes/UserRoute';

const  App = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async(user) => {
      if (user) {
        const idTokenResult = await user.getIdTokenResult();
        currentUser(idTokenResult.token)
        .then((res) =>{
          dispatch({
            type:"LOGGED_IN_USER",
            payload: {
            email: res.data.data.email,
            token: idTokenResult.token,
            role: res.data.data.role,
            _id: res.data.data._id,
            name: res.data.data.name
          },
          });
        }
        )
        .catch(error => {
          toast.error(error.message);
        })
      }
    });
    return () => unsubscribe();
  },[])
  return (
    <>
      <ToastContainer/>
      <Header/>
      <Switch>
        <Route exact path="/" component={Home}/>
        <Route exact path="/login" component={Login}/>
        <Route exact path="/register" component={Register}/>
        <Route exact path="/register/complete" component={RegisterComplete}/>
        <Route exact path="/forgot/password" component={ForgotPassword}/>
        <UserRoute exact path="/user/history" component={History}/>
        <UserRoute exact path="/user/password" component={Password}/>
        <UserRoute exact path="/user/wishlist" component={Wishlist}/>
      </Switch>
    </>
  );
}

export default App;
