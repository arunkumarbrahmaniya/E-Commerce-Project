import React, {useState, useEffect} from 'react';
import AdminNav from '../../../components/nav/AdminNav'
import {toast} from 'react-toastify';
import {useSelector} from 'react-redux';
import {
    getSub,
    updateSub
} from '../../../functions/sub';
import {
    getCategories
} from '../../../functions/category';

import CategoryForm from '../../../components/forms/CategoryForm';
import LocalSearch from '../../../components/forms/LocalSearch';
const SubUpdate = ({match, history}) => {
    const {user} = useSelector((state) => ({...state}));
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState([]);
    const [parent, setParent] = useState('');
    const [keyword, setKeyword] = useState("");
    
    useEffect (() => {
        loadCategories();
        loadSub();
    });
    const loadCategories = async() =>{
        const res = await getCategories();
        setCategories(res.data);
    } 
    const loadSub = async() =>{
        const res = await getSub(match.params.slug);
        setName(res.data.name);
        setParent(res.data.parent);
    } 


    
    const handleSubmit =(e)=> {
        e.preventDefault();
        setLoading(true);
        updateSub(match.params.slug,{name, parent}, user.token)
        .then((res) => {
            setLoading(false);
            setName('');
            toast.success(`"${res.data.name}" is Updated`);
            history.push('/admin/sub');
        })
        .catch((error) => {
            setLoading(false);
            if (error.response.status === 400) {
                toast.error(error.response.data)
            }
        })
    }

    return (
        <div className="container-fluid">
        <div className="row">
            <div className="col-md-2">
                <AdminNav/>
            </div>
            <div className="col">
                {
                    loading ?
                    <h4 className="text-danger">
                        Loading....
                    </h4>
                    :
                    <h4>
                        Update Sub-Category
                    </h4>
                }
                <div className="form-group">
                    <label>
                       Parent Category
                    </label>
                    <select
                        name="category"
                        className="form-control"
                        onChange={(e) => setParent(e.target.value)}
                    >
                        <option>
                            Please Select
                        </option>
                        {
                            categories.length > 0 && categories.map((c) =>
                            (
                            <option
                                key={c._id}
                                value={c._id}
                                selected={c._id === parent}
                            >
                                {c.name}
                            </option>)
                            )
                        }
                    </select>
                </div>
                <CategoryForm
                    handleSubmit={handleSubmit}
                    name={name}
                    setName={setName}
                />
                <LocalSearch
                    keyword={keyword}
                    setKeyword={setKeyword}
                />
                <hr/>
                {/* {
                    subs.filter(searched(keyword)).map((s) => {
                        return (
                            <div className="alert alert-secondary" key ={s._id}>
                                {
                                    s.name
                                }
                                <span onClick={() => handleRemove(s.slug)} className="btn btn-sm float-right">
                                    <DeleteOutlined className="text-danger"/>
                                </span>
                                <Link to={`/admin/category/${s.slug}`}>
                                    <span className="btn btn-sm float-right">
                                        <EditOutlined className="text-warning"/>
                                    </span>
                                </Link>
                            </div>
                        )
                    })
                } */}
            </div>
        </div>
    </div>
    )
}

export default SubUpdate;