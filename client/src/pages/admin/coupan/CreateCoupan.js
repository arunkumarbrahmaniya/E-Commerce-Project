import React, {useState, useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {toast} from 'react-toastify';
import DatePicker from 'react-datepicker';
import {
    getCoupans,
    removeCoupan,
    createCoupan
} from '../../../functions/coupan';
import 'react-datepicker/dist/react-datepicker.css';
import {DeleteOutlined} from '@ant-design/icons';
import AdminNav from '../../../components/nav/AdminNav';


const CreateCoupanPage = () => {
    const [name, setName] = useState('');
    const [expiry, setExpiry] = useState('');
    const [discount, setDiscount] = useState('');
    const [loading, setLoading] = useState('');
    const [coupans, setCoupans] = useState([]);
    const {user} = useSelector((state) => ({...state}));

    useEffect(() => {
        getLatestCoupans();
    },[]);

    const getLatestCoupans = () => {
        getCoupans()
        .then((res) => {
            setCoupans(res.data);
        });
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        createCoupan({name, expiry, discount}, user.token)
        .then((res) => {
            setLoading(false);
            getLatestCoupans();
            setName('');
            setDiscount('');
            setExpiry('');
            toast.success(`"${res.data.name}" is created.`)
        }).catch((error) => {
            console.log("coupan created error", error);
        })
    }

    const handleRemove = (coupanId) => {
        if(window.confirm("Are you sure? You want to delete the coupan.")) {
            setLoading(true);
            removeCoupan(coupanId, user.token).then((res) => {
                getLatestCoupans();
                setLoading(false);
                toast.error(`Coupan "${res.data.name}" is deleted`)
            })
        }
    }



    return (
        <div className="container-fluid p-4">
            <div className="row">
                <div className="col-md-2">
                    <AdminNav/>
                </div>
                <div className="col-md-10">
                    <h4>
                        {
                            loading ?
                            <h4 className="text-danger">
                                Loading...
                            </h4>
                            :
                            <h4>
                                Coupan
                            </h4>
                        }
                    </h4>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label className="text-muted">
                                Name
                            </label>
                            <input
                                className="form-control"
                                onChange={e => setName(e.target.value)}
                                value={name}
                                autoFocus
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label className="text-muted">
                                Discount
                            </label>
                            <input
                                className="form-control"
                                onChange={e => setDiscount(e.target.value)}
                                value={discount}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label className="text-muted">
                                Expiry
                            </label>
                            <br/>
                            <DatePicker
                                className="form-control"
                                selected={new Date()}
                                value={expiry}
                                required
                                onChange={(date) => setExpiry(date)}
                            />
                        </div>
                        <button className="btn btn-outline-primary">
                            SAVE COUPAN
                        </button>
                    </form>
                    <hr/>
                    <h4>
                        {coupans.length} Coupan
                    </h4>
                    <hr/>
                    <table className="table table-bordered">
                        <thead className="thead-light">
                            <tr>
                                <th scope="col">
                                    Name
                                </th>
                                <th scope="col">
                                    Expiry
                                </th>
                                <th scope="col">
                                    Discount
                                </th>
                                <th scope="col">
                                    Action
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                coupans.map((c) => <tr key={c._id}>
                                    <td>
                                        {
                                            c.name
                                        }
                                    </td>
                                    <td>
                                        {
                                            new Date(c.expiry).toLocaleDateString()
                                        }
                                    </td>
                                    <td>
                                        {
                                            c.discount
                                        } %
                                    </td>
                                    <td>
                                        <DeleteOutlined
                                            onClick={()=>handleRemove(c._id)}
                                            className="text-danger pointer"
                                        />
                                    </td>
                                    
                                    
                                </tr>)
                            }
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default CreateCoupanPage;
