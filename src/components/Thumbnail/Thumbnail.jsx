import { EllipsisOutlined } from "@ant-design/icons";
import React from "react";
import GridLayout from 'react-grid-layout';
import { Menu, Dropdown, Button } from 'antd';
import ReactPlayer from 'react-player'

const Thumbnail = ({ item }) => {
    // layout is an array of objects, see the demo for more complete usage
    const layout = [
        { i: "a", x: 0, y: 0, w: 1, h: 2, static: true },
        { i: "b", x: 1, y: 0, w: 1, h: 2, static: true },
        { i: "c", x: 2, y: 0, w: 1, h: 2, static: true },
        { i: "d", x: 3, y: 0, w: 1, h: 2, static: true },
        { i: "e", x: 4, y: 0, w: 1, h: 2, static: true },
        { i: "f", x: 5, y: 0, w: 1, h: 2, static: true },
        { i: "g", x: 6, y: 0, w: 1, h: 2, static: true },
        { i: "h", x: 6, y: 2, w: 1, h: 2, static: true },
        { i: "i", x: 6, y: 4, w: 1, h: 2, static: true },
        { i: "j", x: 6, y: 6, w: 1, h: 2, static: true },
        { i: "k", x: 0, y: 2, w: 1, h: 2, static: true },
        { i: "l", x: 0, y: 4, w: 1, h: 2, static: true },
        { i: "m", x: 0, y: 6, w: 1, h: 2, static: true },
        { i: "n", x: 1, y: 2, w: 5, h: 6, static: true },
    ];

    const url = "https://media.istockphoto.com/photos/pakistan-monument-islamabad-picture-id535695503?k=6&m=535695503&s=612x612&w=0&h=uP8aDK4xlfjk3kEiyr9wwUiuh80UwAiICweFpiBDosk="

    const menu = (
        <Menu>
          <Menu.Item>
            Profile
          </Menu.Item>
          <Menu.Item>
            Swap
          </Menu.Item>
          <Menu.Item>
            Report
          </Menu.Item>
        </Menu>
      );

    return (
        <GridLayout className="layout" layout={layout} rowHeight={12} width={450}>
            <div key="a">
                <img src={url} alt="" style={{ height: "40px", width: "100%" }} />
            </div>
            <div key="b">
                <img src={url} alt="" style={{ height: "40px", width: "100%" }} />
            </div>
            <div key="c">
                <img src={url} alt="" style={{ height: "40px", width: "100%" }} />
            </div>
            <div key="d">
                <img src={url} alt="" style={{ height: "40px", width: "100%" }} />
            </div>
            <div key="e">
                <img src={url} alt="" style={{ height: "40px", width: "100%" }} />
            </div>
            <div key="f">
                <img src={url} alt="" style={{ height: "40px", width: "100%" }} />
            </div>
            <div key="g">
                <img src={url} alt="" style={{ height: "40px", width: "100%" }} />
            </div>
            <div key="h">
                <img src={url} alt="" style={{ height: "40px", width: "100%" }} />
            </div>
            <div key="i">
                <img src={url} alt="" style={{ height: "40px", width: "100%" }} />
            </div>
            <div key="j">
                <img src={url} alt="" style={{ height: "40px", width: "100%" }} />
            </div>
            <div key="k">
                <img src={url} alt="" style={{ height: "40px", width: "100%" }} />
            </div>
            <div key="l">
                <img src={url} alt="" style={{ height: "40px", width: "100%" }} />
            </div>
            <div key="m">
                <img src={url} alt="" style={{ height: "40px", width: "100%" }} />
            </div>
            <div key="n">
                <img src={item.thumbnail_url} alt="" style={{ height: "128px", width: "100%" }} />
                <div style={{ position: "absolute", top: "0px", right: "0px" }}>
                    <span style={{ background: "black", padding: "2px", color: "white" }}>
                        <Dropdown overlay={menu} placement="bottomCenter" arrow>
                            <EllipsisOutlined style={{ cursor: "pointer" }} />
                        </Dropdown>
                        
                    </span>
                </div>
            </div>
        </GridLayout>
    )
}

export default Thumbnail