import React from "react";
import { FloatButton } from "antd";
import {
  HomeOutlined,
  SettingOutlined,
  PlusOutlined,
  BookOutlined,
  PictureOutlined,
  AndroidFilled,
} from "@ant-design/icons";

const MenuButton = () => {
  return (
    <FloatButton.Group
      trigger="hover"
      type="primary"
      style={{ right: 24 }}
      icon={<AndroidFilled />}
    >
      <FloatButton
        icon={<HomeOutlined />}
        tooltip="Home"
        onClick={() => {
            console.log("Navigating to Home");
            window.location.href = "/";
        }}
      />
      <FloatButton
        icon={<SettingOutlined />}
        tooltip="Settings"
        onClick={() => console.log("Navigating to Settings")}
      />
      <FloatButton
        icon={<PictureOutlined />}
        tooltip="Gallery View"
        onClick={() => console.log("Navigating to Gallery View")}
      />
      <FloatButton
        icon={<BookOutlined />}
        tooltip="Journal List View"
        onClick={() => {
            console.log("Navigating to Journal List View");
            window.location.href = "/journals";
        }}
      />
      <FloatButton
        icon={<PlusOutlined />}
        tooltip="New Journal"
        onClick={() => console.log("Creating a new Journal")}
      />
    </FloatButton.Group>
  );
};

export default MenuButton;
