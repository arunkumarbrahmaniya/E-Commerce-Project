import React from 'react';
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
import AdminNav from '../../../components/nav/AdminNav'


const CreateCoupanPage = () => {
    return (
        <div className="container-fluid">
            <div className="row">
            <div className="col-md-2">
                <AdminNav/>
            </div>
            </div>
            <h4>
                Coupan
            </h4>
        </div>
    )
}

export default CreateCoupanPage;
