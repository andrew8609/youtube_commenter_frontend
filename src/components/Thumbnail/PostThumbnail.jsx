import React from "react";
import GridLayout from 'react-grid-layout';
import ReactPlayer from 'react-player'

class PostThumbnail extends React.Component {
    render() {
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

        const url = "https://images.unsplash.com/photo-1541963463532-d68292c34b19?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxleHBsb3JlLWZlZWR8M3x8fGVufDB8fHw%3D&w=1000&q=80 "
        return (
            <GridLayout className="layout" layout={layout} cols={8} rowHeight={40} width={750}>
                <div key="a">
                    <img src={url} alt=""   style={{ height: "90px", width: "100%" }}/>
                </div>
                <div key="b">
                    <img src={url} alt=""   style={{ height: "90px", width: "100%" }}/>
                </div>
                <div key="c">
                    <img src={url} alt=""   style={{ height: "90px", width: "100%" }}/>
                </div>
                <div key="d">
                    <img src={url} alt=""   style={{ height: "90px", width: "100%" }}/>
                </div>
                <div key="e">
                    <img src={url} alt=""   style={{ height: "90px", width: "100%" }}/>
                </div>
                <div key="f">
                    <img src={url} alt=""   style={{ height: "90px", width: "100%" }}/>
                </div>
                <div key="g">
                    <img src={url} alt=""   style={{ height: "90px", width: "100%" }}/>
                </div>
                <div key="h">
                    <img src={url} alt="" style={{ height: "90px", width: "100%" }}/>
                </div>
                <div key="i">
                    <img src={url} alt="" style={{ height: "90px", width: "100%" }}/>
                </div>
                <div key="j">
                    <img src={url} alt=""   style={{ height: "90px", width: "100%" }}/>
                </div>
                <div key="k">
                    <img src={url} alt=""   style={{ height: "90px", width: "100%" }}/>
                </div>
                <div key="l">
                    <img src={url} alt=""   style={{ height: "90px", width: "100%" }}/>
                </div>
                <div key="m">
                    <img src={url} alt=""  style={{ height: "90px", width: "100%" }}/>
                </div>
                <div key="n">
                    {/* <img src={url} alt="" style={{ height: "290px", width: "100%" }} /> */}
                    <ReactPlayer url='https://www.youtube.com/watch?v=ysz5S6PUM-U' style={{ height: "290px", width: "100%" }}/>
                </div>
            </GridLayout>
        )
    }
}

export default PostThumbnail