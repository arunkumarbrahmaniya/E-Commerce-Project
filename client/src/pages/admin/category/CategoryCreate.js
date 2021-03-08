import React, {useState, useEffect} from 'react';
import AdminNav from '../../../components/nav/AdminNav'
import {toast} from 'react-toastify';
import {useSelector} from 'react-redux';
import { Link } from 'react-router-dom';
import {createCategory,
    getCategories,
    removeCategory
} from '../../../functions/category';
import {
    EditOutlined,
    DeleteOutlined
} from '@ant-design/icons';
import CategoryForm from '../../../components/forms/CategoryForm';
import LocalSearch from '../../../components/forms/LocalSearch';
const CategoryCreate = () => {
    const {user} = useSelector((state) => ({...state}));
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState([]);
    const [keyword, setKeyword] = useState("");
    
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
            toast.success(`"${res.data.name}" is created`);
            loadCategories();
        })
        .catch(error => {
            setLoading(false);
            if (error.response.status === 400) {
                toast.error(error.response.data)
            }
        })
    }

    const handleRemove = async(slug) => {
        let answer =window.confirm("Are you sure? Want to Delete this category.");
        if (answer) {
            setLoading(true);
            await removeCategory(slug, user.token)
            .then((res) => {
                setLoading(false);
                toast.error(`${res.data.name} deleted`);
                loadCategories();
            })
            .catch((error) => {
                if (error.response.status === 400) {
                    setLoading(false);
                    toast.error(error.response.data);
                }
            })
        }
    }
    

    const searched = (keyword) => (c) => c.name.toLowerCase().includes(keyword)
    
    return (
        <div className="container-fluid p-4">
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
                {
                    categories.filter(searched(keyword)).map((category) => {
                        return (
                            <div className="alert alert-secondary" key ={category._id}>
                                {
                                    category.name
                                }
                                <span onClick={() => handleRemove(category.slug)} className="btn btn-sm float-right">
                                    <DeleteOutlined className="text-danger"/>
                                </span>
                                <Link to={`/admin/category/${category.slug}`}>
                                    <span className="btn btn-sm float-right">
                                        <EditOutlined className="text-warning"/>
                                    </span>
                                </Link>
                            </div>
                        )
                    })
                }
            </div>
        </div>
    </div>
    )
}

export default CategoryCreate;