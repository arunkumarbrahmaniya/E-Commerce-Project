import React, { useState, useEffect } from 'react';
import { auth, googleAuthProvider } from '../../firebase';
import { toast } from 'react-toastify';
import { MailOutlined, GoogleOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { createOrUpdateUser } from '../../functions/auth';

const Login = ({history}) => {
    const [email, setEmail] = useState('kumar.fairandfair@gmail.com');
    const [password, setPassword] = useState('AArr22@@');
    const [loading, setLoading] = useState(false);
    const { user } = useSelector((state) => ({...state})); 
    useEffect(() => {
        let intended = history.location.state;
        if (intended) {
            return;
        } else {
            if(user && user.token){
                history.push("/");
            } 
        }
    }, [user, history]);
    let dispatch = useDispatch();
    const roleBasedRedirect = (res) => {
        // check if intended
        let intended = history.location.state;
        if (intended) {
            history.push(intended.from);
        } else {
            if (res.data.data.role === 'admin') {
                history.push('/admin/dashboard');
            } else {
                history.push('/user/history');
            }
        } 
    }
    const handleSubmit = async(e) => {
        e.preventDefault();
        setLoading(true);
        try{
           const result = await auth.signInWithEmailAndPassword(email, password);
           const { user } = result;
           const idTokenResult = await user.getIdTokenResult();
           createOrUpdateUser(idTokenResult.token)
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
                roleBasedRedirect(res);
           })
           .catch(error => {
               toast.error(error.message);
           })
        } catch(error){
            toast.error(error.message);
            setLoading(false);
        }
    }
    const googleLogin = async() => {
        auth.signInWithPopup(googleAuthProvider)
        .then(async(result) => {
            const { user } = result;
            const idTokenResult = await user.getIdTokenResult();
            createOrUpdateUser(idTokenResult.token)
           .then((res) =>
            dispatch({
            type:"LOGGED_IN_USER",
            payload: {
                email: res.data.data.email,
                token: idTokenResult.token,
                role: res.data.data.role,
                _id: res.data.data._id,
                name: res.data.data.name
            },
            }),
            )
           .catch(error => {
               toast.error(error.message);
           })
            history.push('/');
        })
        .catch((error) => {
            toast.error(error.message);
        })
    }
    const loginForm = () => {
        return (
            <>
                <div className="form-group">
                    <input
                        type="email"
                        className="form-control"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        autoFocus
                        placeholder="Enter your email"
                    />
                </div>
                <div className="form-group">
                    <input
                        type="password"
                        className="form-control"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter your Password"
                    />
                </div>
                <Button onClick={handleSubmit}
                    type="primary"
                    icon={<MailOutlined />}
                    className="mb-3"
                    shape="round"
                    size="large"
                    block
                    disabled={!email || password.length < 6}
                >
                    Login with Email/Password
                </Button>
                </>
        )
    }
    return (
        <div className="container p-5">
            <div className="row">
                <div className="col-md-6 offset-md-3">
                    {loading ?
                    <h4 className="text-danger">
                        Loading...
                    </h4> :
                    <h4>
                        Login
                    </h4>
                    }
                    {loginForm()}
                    <Button onClick={googleLogin}
                        type="danger"
                        icon={<GoogleOutlined />}
                        className="mb-3"
                        shape="round"
                        size="large"
                        block
                    >
                        Login with Google
                    </Button>
                    <Link to="/forgot/password" className="float-right text-danger"> Forgot Password</Link>
                </div>
            </div>
        </div>
    );
};

export default Login;