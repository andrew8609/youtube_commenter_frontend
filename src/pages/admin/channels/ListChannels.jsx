import { Button } from "@material-ui/core";
import { DeleteOutline } from "@material-ui/icons";
import { List } from "antd";
import "antd/dist/antd.css";
import { createElement } from "react";

export default function ListChannels({ channels, handleDialog }) {
  const listData = [];
  for (let i = 0; i < 23; i++) {
    listData.push({
      href: "https://ant.design",
      title: `ant design part ${i}`,
      avatar: "https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png",
      description: "Ant Design, a design language for background applications, is refined by Ant UED Team.",
      content:
        "We supply a series of design principles, practical patterns and high quality design resources (Sketch and Axure), to help people create their product prototypes beautifully and efficiently.",
    });
  }

  const IconText = ({ icon, text }) => (
    <Button size="small" color="secondary" onClick={() => handleDialog()}>
      {createElement(icon)}
      Delete
    </Button>
  );

  return (
    <List
      itemLayout="vertical"
      size="large"
      style={{ textAlign: "left", margin: "40px" }}
      pagination={{
        onChange: (page) => {
          console.log(page);
        },
        pageSize: 10,
      }}
      dataSource={channels}
      footer={null}
      renderItem={(item) => (
        <List.Item
          key={item.id}
          style={{ background: "white", margin: "20px" }}
          actions={[<IconText icon={DeleteOutline} text="156" key="list-vertical-star-o" />]}
        >
          <List.Item.Meta
            avatar={
              // <Avatar src={item.thumbnail_image_url} size="large"/>
              <img style={{ width: "auto", height: "150px" }} alt="car" src={item.thumbnail_image_url} />
            }
            title={item.title}
            description={item.description.split("\n").map((item1) => (
              <span>
                {item1}
                <br />
              </span>
            ))}
          />
          <span style={{ color: "white" }}>
            {[1, 2, 3, 4, 5, 6, 7].map((item) => (
              <span key={item}>fdsafhdsajkfhdjsak </span>
            ))}
          </span>
        </List.Item>
      )}
    />
  );
}
