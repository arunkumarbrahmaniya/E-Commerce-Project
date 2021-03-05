import React, { useState } from 'react';
import { Menu } from 'antd';
import { UserAddOutlined,
    HomeOutlined, LoginOutlined,
    UserOutlined } from
    '@ant-design/icons';
import { Link } from 'react-router-dom';

const { SubMenu } = Menu;

const Header = () => {
    const [current, setCurrent] = useState('');

    const handleClick = (e) => {
        setCurrent(e.key);
    }
    return (
        <Menu onClick={handleClick} selectedKeys={[current]} mode="horizontal">
            <Menu.Item key="home" icon={<HomeOutlined />}>
                <Link to="/">
                    Home
                </Link>
            </Menu.Item>
            <Menu.Item key="register" icon={<UserAddOutlined />} className="float-right">
                <Link to="/register">
                    Register
                </Link>
            </Menu.Item>
            <Menu.Item key="login" icon={<LoginOutlined />} className="float-right">
                <Link to="/login">
                    Login
                </Link>
            </Menu.Item>
            <SubMenu key="SubMenu" icon={ <UserOutlined />} title="Username">
                <Menu.Item key="setting:1">Option 1</Menu.Item>
                <Menu.Item key="setting:2">Option 2</Menu.Item>
            </SubMenu>
      </Menu>
    )
}

export default Header;