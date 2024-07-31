import React, { useState } from 'react';
import { Space, Input, DatePicker, Button, Radio, Select } from 'antd';
// import { SearchFilters } from '../../utils/getFilterPhotos';
import dayjs from 'dayjs';
const { RangePicker } = DatePicker;

interface SearchBarProps {
    onFilterChange?: (filters: SearchFilters) => void;
    onFilterSet?: () => void;
    initFilters?: SearchFilters;
}

interface SearchFilters {
    starred?: boolean;
    device?: string | null;
    fromDate?: string | null;
    toDate?: string | null ;
    contains?: string | null;
}

const dateFormat = 'YYYY-MM-DD';

const SearchBar: React.FC<SearchBarProps> = ({initFilters, onFilterChange, onFilterSet}) => {
    console.log("searchbar",initFilters);


    const handleStarredChange = (e: any) => { 
        const isChecked = e.target.value === 'starred';
        
        onFilterChange?.({ 
            starred: isChecked, 
            device: initFilters?.device, 
            fromDate: initFilters?.fromDate, 
            toDate: initFilters?.toDate, 
            contains: initFilters?.contains });
    };

    const handleDatePickerChange = (dates: any, dateStrings: [string, string]) => {
        onFilterChange?.({ 
            starred: initFilters?.starred, 
            device: initFilters?.device, 
            fromDate: dateStrings[0], 
            toDate: dateStrings[1], 
            contains: initFilters?.contains });
    };

    const handleDeviceChange = (value: string) => {
        console.log("device",value);
        onFilterChange?.({ 
            starred: initFilters?.starred, 
            device: value, 
            fromDate: initFilters?.fromDate, 
            toDate: initFilters?.toDate, 
            contains: initFilters?.contains });
    };

    const handleContainsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onFilterChange?.({ 
            starred: initFilters?.starred, 
            device: initFilters?.device, 
            fromDate: initFilters?.fromDate, 
            toDate: initFilters?.toDate, 
            contains: e.target.value });
    };

    const handleFilterButtonClick = () => {
        onFilterSet?.();
    };
    const fromDateInit = initFilters?.fromDate ? initFilters?.fromDate : "2024-01-01";
    const toDateInit = initFilters?.toDate ? initFilters?.toDate : "2024-12-31";
    console.log("fromDateInit",fromDateInit);
    console.log("toDateInit",toDateInit);

    return (
        <Space>
            <Radio.Group buttonStyle='solid' onChange={handleStarredChange} value={initFilters?.starred ? 'starred' : 'all'}>
                <Radio.Button value="all">All</Radio.Button>
                <Radio.Button value="starred">Starred</Radio.Button>
            </Radio.Group>
            <RangePicker
                defaultValue={[dayjs(fromDateInit, dateFormat), dayjs(toDateInit, dateFormat)]}
                onChange={handleDatePickerChange}
            />
            <Select placeholder='Device' onChange={handleDeviceChange} value={initFilters?.device}>
                <Select.Option value="laptop">Laptop</Select.Option>
                <Select.Option value="tablet">Tablet</Select.Option>
                <Select.Option value="phone">Phone</Select.Option>
                <Select.Option value="all">Phone</Select.Option>
            </Select>
            <Input placeholder="Search Content..." onChange={handleContainsChange} value={initFilters?.contains || ''} />
            <Button type="primary" onClick={handleFilterButtonClick}>Filter</Button>
        </Space>
    );
};

export default SearchBar;
export type { SearchFilters };