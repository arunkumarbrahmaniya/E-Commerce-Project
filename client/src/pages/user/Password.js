import React, {useState} from 'react';
import UserNav from '../../components/nav/UserNav';
import { auth } from '../../firebase';
import {toast} from 'react-toastify';

const Password = () => {
    const [password, setPassword] = useState();
    const [loading, setLoading] = useState(false);
    const handleSubmit = async(e) => {
        e.preventDefault();
        setLoading(true);
        await auth.currentUser.updatePassword(password)
        .then(() => {
            setLoading(false);
            setPassword('');
            toast.success("Password Updated");
        })
        .catch((error) => {
            setLoading(false)
            toast.error(error.message)
        })
    }
    const passwordUpdateForm = () => {
        return (
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Your Password</label>
                    <input
                        type="password"
                        onChange={(e) => setPassword(e.target.value)}
                        className="form-control"
                        placeholder="Enter Your Password"
                        disabled={loading}
                        value={password}
                    />
                    <br/>
                    <button className="btn btn-primary" disabled={!password || (password.length < 6) || loading}>
                        Change Password
                    </button>
                </div>
            </form>
        )
    }
    return (
        <div className="container-fluid">
        <div className="row">
            <div className="col-md-2">
                <UserNav/>
            </div>
            <div className="col">
                {
                    loading ?
                    <h1 className="text-danger">
                    Updating Password.....
                    </h1>
                    :
                    <h1>
                    Password Update
                    </h1>
                }
                {
                    passwordUpdateForm()
                }
            </div>
        </div>
    </div>
    )
}

export default Password;