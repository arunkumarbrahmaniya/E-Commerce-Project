import React, {useState, useEffect} from 'react';
import AdminNav from '../../../components/nav/AdminNav'
import {toast} from 'react-toastify';
import {useSelector} from 'react-redux';
import {createCategory,
    getCategories,
    removeCategory
} from '../../../functions/category';

const CategoryCreate = () => {
    const {user} = useSelector((state) => ({...state}));
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState([]);
    useEffect (() => {
        loadCategories();
    },[]);
    const loadCategories = async() =>{
        const res = await getCategories();
        setCategories(res.data);
    } 
    
    const handleSubmit =(e)=> {
        e.preventDefault();
        setLoading(true);
        createCategory({name}, user.token)
        .then((res) => {
            setLoading(false);
            setName('');
            toast.success(`"${res.data.name}" is created`)
        })
        .catch(error => {
            setLoading(false);
            if (error.response.status === 400) {
                toast.error(error.response.data)
            }
        })
    }
    const categoryForm = () => {
        return (
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>
                        Name
                    </label>
                    <input
                        type="text"
                        className="form-control"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        autoFocus
                        required
                    />
                    <br/>
                    <button className="btn btn-outline-primary">
                        Create Category
                    </button>
                </div>
            </form>
        )
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
                        Create Category
                    </h4>
                }
                {
                    categoryForm()
                }
                <hr/>
                {
                    categories.length
                }
            </div>
        </div>
    </div>
    )
}

export default CategoryCreate;