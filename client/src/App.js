import React, {useEffect} from 'react';
import { Switch, Route } from 'react-router-dom';
import SideDrawer from './components/drawer/SideDrawer';
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
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminRoute  from './components/routes/AdminRoute';
import CategoryCreate from './pages/admin/category/CategoryCreate';
import CategoryUpdate from './pages/admin/category/CategoryUpdate';
import SubCreate from './pages/admin/sub/SubCreate';
import SubUpdate from './pages/admin/sub/SubUpdate';
import ProductCreate from './pages/admin/product/ProductCreate';
import AllProducts from './pages/admin/product/AllProducts';
import ProductUpdate from './pages/admin/product/ProductUpdate';
import Product from './pages/Product';
import CategoryHome from './pages/category/CategoryHome';
import SubHome from './pages/sub/SubHome';
import Shop from './pages/Shop';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import CreateCoupanPage from './pages/admin/coupan/CreateCoupan';
import Payment from './pages/Payment';

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
            name: res.data.data.name,
            address: res.data.data.address
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
  },[dispatch])
  return (
    <>
      <ToastContainer/>
      <Header/>
      <SideDrawer/>
      <Switch>
        <Route exact path="/" component={Home}/>
        <Route exact path="/login" component={Login}/>
        <Route exact path="/register" component={Register}/>
        <Route exact path="/register/complete" component={RegisterComplete}/>
        <Route exact path="/forgot/password" component={ForgotPassword}/>
        <UserRoute exact path="/user/history" component={History}/>
        <UserRoute exact path="/user/password" component={Password}/>
        <UserRoute exact path="/user/wishlist" component={Wishlist}/>
        <AdminRoute exact path="/admin/dashboard" component={AdminDashboard}/>
        <AdminRoute exact path="/admin/category" component={CategoryCreate}/>
        <AdminRoute exact path="/admin/category/:slug" component={CategoryUpdate}/>
        <AdminRoute exact path="/admin/sub" component={SubCreate}/>
        <AdminRoute exact path="/admin/sub/:slug" component={SubUpdate}/>
        <AdminRoute exact path="/admin/product" component={ProductCreate}/>
        <AdminRoute exact path="/admin/products" component={AllProducts}/>
        <AdminRoute exact path="/admin/product/:slug" component={ProductUpdate}/>
        <Route exact path="/product/:slug" component={Product}/>
        <Route exact path="/category/:slug" component={CategoryHome}/>
        <Route exact path="/subs/:slug" component={SubHome}/>
        <Route exact path="/shop" component={Shop}/>
        <Route exact path="/cart" component={Cart}/>
        <Route exact path="/checkout" component={Checkout}/>
        <AdminRoute exact path="/admin/coupan" component={CreateCoupanPage}/>
        <UserRoute exact path="/payment" component={Payment}/>
        
      </Switch>
    </>
  );
}

export default App;
