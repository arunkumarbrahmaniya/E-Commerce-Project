import React from 'react';
import { Select } from 'antd';
const { Option } = Select;
const ProductUpdateForm = ({
    handleSubmit,
    handleChange,
    values,
    setValues,
    categories,
    subOptions,
    selectedCategory,
    arrayOfSubs,
    setArrayOfSubs,
    handleCategoryChange
}) => {
    const { 
        title, description, price,
        category, subs,
        shipping, quantity, images,
        color, colors, brands, brand,
    } = values;
    return (
        <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>
                                Title
                            </label>
                            <input
                                name="title"
                                type="text"
                                className="form-control"
                                value={title}
                                onChange={(handleChange)}
                            />
                        </div>
                        <div className="form-group">
                            <label>
                                Description
                            </label>
                            <input
                                name="description"
                                type="text"
                                className="form-control"
                                value={description}
                                onChange={(handleChange)}
                            />
                        </div>
                        <div className="form-group">
                            <label>
                                Price
                            </label>
                            <input
                                name="price"
                                type="number"
                                className="form-control"
                                value={price}
                                onChange={(handleChange)}
                            />
                        </div>
                        <div className="form-group">
                            <label>
                                Shipping
                            </label>
                            <select
                                name="shipping"
                                className="form-control"
                                onChange={handleChange}
                                value={shipping === 'Yes' ? "Yes" : "No"}
                            >
                                <option>
                                    Please Select Color
                                </option>
                                <option value="No">
                                    No
                                </option>
                                <option value="Yes">
                                    Yes
                                </option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>
                                Quantity
                            </label>
                            <input
                                name="quantity"
                                type="number"
                                className="form-control"
                                value={quantity}
                                onChange={(handleChange)}
                            />
                        </div>
                        <div className="form-group">
                            <label>
                                Color
                            </label>
                            <select
                                name="color"
                                className="form-control"
                                onChange={handleChange}
                                value={color}
                            >
                                <option>
                                    Please Select Color
                                </option>
                                {
                                    colors.map((c) => {
                                        return (
                                            <option
                                                key={c}
                                                value={c}
                                            >
                                                {
                                                    c
                                                }
                                            </option>
                                        )
                                    })
                                }
                            </select>
                        </div>
                        <div className="form-group">
                            <label>
                                Brand
                            </label>
                            <select
                                name="brand"
                                className="form-control"
                                onChange={handleChange}
                                value={brand}
                            >
                                <option>
                                    Please Select Brand
                                </option>
                                {
                                    brands.map((b) => {
                                        return (
                                            <option
                                                key={b}
                                                value={b}
                                            >
                                                {
                                                    b
                                                }
                                            </option>
                                        )
                                    })
                                }
                            </select>
                        </div>
                        <div className="form-group">
                            <label>
                                Category
                            </label>
                            <select
                                name="category"
                                className="form-control"
                                onChange={handleCategoryChange}
                                value={selectedCategory ? selectedCategory : category._id}
                            >
                                {
                                    categories.length > 0 && categories.map((c) =>
                                    (
                                    <option key={c._id} value={c._id}>
                                        {c.name}
                                    </option>
                                    )
                                    )
                                }
                            </select>
                        </div>
                            <div>
                            <label>
                                Sub-Categories
                            </label>
                            <Select
                                mode="multiple"
                                style={{width:'100%'}}
                                placeholder="Please Select Sub-Categories"
                                value={arrayOfSubs}
                                onChange={(value) => setArrayOfSubs(value)}
                                name="subs"
                            >
                                {
                                    subOptions.length &&  subOptions.map((options) => {
                                        return (
                                            <Option key={options._id} value={options._id}>
                                                {
                                                    options.name
                                                }
                                            </Option>
                                        )
                                    })
                                }
                            </Select>
                        </div>
                        <br/>
                        <button className="btn btn-outline-primary">
                            UPDATE PRODUCT
                        </button>
                    </form>
    )
}

export default ProductUpdateForm;