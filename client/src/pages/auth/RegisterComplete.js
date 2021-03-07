import React, { useState, useEffect } from 'react';
import { auth } from '../../firebase';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { createOrUpdateUser } from '../../functions/auth';

const RegisterComplete = ({history}) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    // const { user } = useSelector((state) => ({...state}));
    useEffect(() => {
        setEmail(localStorage.getItem("emailForRegistration"))
    }, [history])
    let dispatch = useDispatch();
    const handleSubmit = async(e) => {
        e.preventDefault();
        if (!email || !password) {
            toast.error("Email and Password required");
            return;
        }
        if (password.length < 6) {
            toast.error("Password must be atleast 6 characters long");
            return;
        }
        try{
            const result = await auth.signInWithEmailLink(email,window.location.href);
            if (result.user.emailVerified) {
                localStorage.removeItem("emailForRegistration");
                let user = auth.currentUser;
                await user.updatePassword(password);
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
            }
        } catch(error) {
            toast.error(error.message)
        }
    }
    const completeRegisterationForm = () => {
        return (
            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    className="form-control"
                    value={email}
                    disabled
                />
                <br/>
                <input
                    type="password"
                    className="form-control"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    autoFocus
                    placeholder="Enter your password"
                />
                <br/>
                <button type="submit" className="btn btn-raised">Complete Registeration</button>
            </form>
        )
    }
    return (
        <div className="container p-5">
            <div className="row">
                <div className="col-md-6 offset-md-3">
                    <h4>
                        Complete Registeration
                    </h4>
                    {completeRegisterationForm()}
                </div>
            </div>
        </div>
    );
};

export default RegisterComplete;