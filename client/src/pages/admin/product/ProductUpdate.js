import React, {useState, useEffect} from 'react';
import AdminNav from '../../../components/nav/AdminNav'
import {toast} from 'react-toastify';
import {useSelector} from 'react-redux';
import {
    getSingleProduct,
    updateProduct
} from '../../../functions/product';
import {
    getCategories,
    getCategorySubs
} from '../../../functions/category';
import FileUpload from '../../../components/forms/FileUpload';
import { LoadingOutlined} from '@ant-design/icons';
import ProductUpdateForm from '../../../components/forms/ProductUpdateForm';

const initialState = {
    title: '',
    description: "",
    price: "",
    category: "",
    subs: [],
    shipping: "",
    quantity:"",
    images:[],
    colors: ["Black", "Brown", "Silver", "White","Blue"],
    brands: ["Apple", "Samsung", "Microsoft", "Lenovo","Asus"],
    color: "",
    brand: ""
};
const ProductUpdate = ({match, history}) => {
    const {user} = useSelector((state) => ({...state}));
    const [values, setValues] = useState(initialState);
    const [subOptions, setsubOptions] = useState([]);
    const [categories, setCategories] = useState([]);
    const [arrayOfSubs, setArrayOfSubs] = useState([]);
    const [selectedCategory,setSelectedCategory] = useState('');
    const [loading, setLoading] = useState(false);
    const { slug } = match.params;
    useEffect(() => {
        loadProduct();
        loadCategories();
    },[]);

    const loadProduct = () => {
        getSingleProduct(slug)
        .then((product) => {
            setValues({...values, ...product.data});
            getCategorySubs(product.data.category._id)
            .then((res) => {
                setsubOptions(res.data);
            });
            let arr = [];
            product.data.subs.map(s => {
                arr.push(s._id);
            });
            setArrayOfSubs((prev) => arr);
        });
    };

    const loadCategories = async() =>{
        const res = await getCategories();
        setCategories(res.data);
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        values.subs = arrayOfSubs;
        values.category = selectedCategory ? selectedCategory : values.category;
        updateProduct(slug, values, user.token)
        .then((res) => {
            setLoading(false);
            toast.success(`${res.data.title} is updated`);
            history.push('/admin/products');
        })
        .catch((error) => {
            setLoading(false);
            toast.error(error.response.data.error)
        })
    }

    const handleChange = (e) => {
        setValues({...values, [e.target.name]: e.target.value});
    }

    const handleCategoryChange = (e) => {
        e.preventDefault();
        setValues({...values,subs:[]});
        setSelectedCategory(e.target.value);
        getCategorySubs(e.target.value)
        .then((res) => {
            setsubOptions(res.data)
        });

        if (values.category._id === e.target.value) {
            loadProduct();
        }
        setArrayOfSubs([]);
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
                            <LoadingOutlined
                                className="text-danger h1"
                            />
                            :
                            "Update Product"
                        }
                    </h4>
                    <div className="p-3">
                        <FileUpload
                            values={values}
                            setValues={setValues}
                            setLoading={setLoading}
                        />
                    </div>
                    <ProductUpdateForm
                        handleSubmit={handleSubmit}
                        handleChange={handleChange}
                        setValues={setValues}
                        values={values}
                        categories={categories}
                        subOptions={subOptions}
                        arrayOfSubs={arrayOfSubs}
                        setArrayOfSubs={setArrayOfSubs}
                        selectedCategory={selectedCategory}
                        handleCategoryChange={handleCategoryChange}
                    />
                    <hr/>
                </div>
            </div>
        </div>
    )
}

export default ProductUpdate;