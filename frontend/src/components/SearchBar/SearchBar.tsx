import React from 'react';
import MyLayout from '../../components/Layout';
import { Avatar, List, Space, Input, DatePicker, Button, Radio, Select, Tag } from 'antd';
import { StarOutlined } from '@ant-design/icons';

const { RangePicker } = DatePicker;

const SearchBar = () => (
    <Space>
        <Radio.Group buttonStyle='solid'>
            <Radio.Button value="all">All</Radio.Button>
            <Radio.Button value="starred">Starred</Radio.Button>
        </Radio.Group>
        <RangePicker showTime />
        <Select placeholder='Device'>
            <Select.Option value="laptop">Laptop</Select.Option>
            <Select.Option value="tablet">Tablet</Select.Option>
            <Select.Option value="phone">Phone</Select.Option>
        </Select>
        <Input placeholder="Search Content..." />
        <Button type="primary">Filter</Button>
    </Space>
);

export default SearchBar;