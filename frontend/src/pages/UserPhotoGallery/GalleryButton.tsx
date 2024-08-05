import React from 'react';
import { useState } from 'react';
import { Button, message, Space, Upload } from 'antd';
import { DeleteOutlined, FileAddOutlined, EditOutlined, DownloadOutlined, SendOutlined } from '@ant-design/icons';
import UploadModal from "../../components/UploadModal/UploadModel";



interface GalleryButtonsProps {
    checkPhotoNum?: number;
    handleDelete?: () => void;
    handleEdit?: () => void;
    handleDownload?: () => void;
    handleGenerate?: () => void;
    onUploadSuccess?: (imageUrl: string) => void;
}
const GalleryButtons: React.FC<GalleryButtonsProps> = ({checkPhotoNum, handleDownload, handleDelete, handleEdit, handleGenerate, onUploadSuccess }) => {
    const [isUploadModalVisible, setIsUploadModalVisible] = useState(false);

    const handleAdd = () => {
        setIsUploadModalVisible(true);
    }

    const handleCloseUploadModal = () => {
        setIsUploadModalVisible(false);
        window.location.reload();

    };

    return (
        <Space align="center" style={{ width: '100%', justifyContent: 'left' }}>
     
        <Button type="primary" shape="round" icon={<DeleteOutlined />} size={'middle'} onClick={handleDelete} disabled={(checkPhotoNum !== undefined && checkPhotoNum == 0) || false}>
          Delete
        </Button>
        <Button type="primary" shape="round" icon={<FileAddOutlined />} size={'middle'} onClick={handleAdd}>
          Add
        </Button>
        <Button type="primary" shape="round" icon={<EditOutlined />} size={'middle'} onClick={handleEdit} disabled={(checkPhotoNum !== undefined && (checkPhotoNum > 1 || checkPhotoNum == 0)) || false}>
          Edit
        </Button>
        <Button type="primary" shape="round" icon={<DownloadOutlined />} size={'middle'} onClick={handleDownload} disabled={(checkPhotoNum !== undefined && checkPhotoNum == 0) || false}>
          Download
        </Button>
        <Button type="primary" shape="round" icon={<SendOutlined /> } size={'middle'} onClick={handleGenerate} disabled={(checkPhotoNum !== undefined && checkPhotoNum == 0) || false}> 
        </Button>
        <UploadModal
                isVisible={isUploadModalVisible}
                onClose={handleCloseUploadModal}
                onUploadSuccess={onUploadSuccess? onUploadSuccess : () => {}}
            />
        </Space>
    )


}

export default GalleryButtons;
