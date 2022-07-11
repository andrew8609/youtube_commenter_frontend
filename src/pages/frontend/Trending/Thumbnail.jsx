// import { EllipsisOutlined } from "@ant-design/icons";
// import React, { useState } from "react";
// import GridLayout from 'react-grid-layout';
// import { Menu, Dropdown } from 'antd';
// import ReactPlayer from 'react-player'
// import { useQuery } from "@apollo/client";
// import "react-grid-layout/css/styles.css"
// import { getCommentsByPostID } from "../../../graphql/queries/comments";

// const Thumbnail = ({ item, page_nos, updatePageNos, index}) => {
//     const [loading1, setLoading1] = useState(false)
//     const res = useQuery(getCommentsByPostID, { variables: { id: item.id, page_no: 0 }})

//     // layout is an array of objects
//     const layout = [
//         { i: "0", x: 0, y: 0, w: 1, h: 2, static: true },
//         { i: "1", x: 1, y: 0, w: 1, h: 2, static: true },
//         { i: "2", x: 2, y: 0, w: 1, h: 2, static: true },
//         { i: "3", x: 3, y: 0, w: 1, h: 2, static: true },
//         { i: "4", x: 4, y: 0, w: 1, h: 2, static: true },
//         { i: "5", x: 5, y: 0, w: 1, h: 2, static: true },
//         { i: "6", x: 6, y: 0, w: 1, h: 2, static: true },
//         { i: "7", x: 6, y: 2, w: 1, h: 2, static: true },
//         { i: "8", x: 6, y: 4, w: 1, h: 2, static: true },
//         { i: "9", x: 6, y: 6, w: 1, h: 2, static: true },
//         { i: "10", x: 0, y: 2, w: 1, h: 2, static: true },
//         { i: "11", x: 0, y: 4, w: 1, h: 2, static: true },
//         { i: "12", x: 0, y: 6, w: 1, h: 2, static: true },
//         { i: "n", x: 1, y: 2, w: 5, h: 6, static: true },
//     ];

//     const [data, setData] = useState([])

//     const OnSwap = async () => { 
//         await res.fetchMore({variables: {id: item.id, page_no: page_nos[index] + 1}, updateQuery: (prevResult, {fetchMoreResult}) => {
//             if(fetchMoreResult.getCommentsByPostID.length) {
//                 setData(fetchMoreResult.getCommentsByPostID)
//             }
//         }})

//         updatePageNos(page_nos, index)
//     }

//     const menu = (
//         <Menu>
//             <Menu.Item>
//                 Profile
//           </Menu.Item>
//             <Menu.Item onClick={OnSwap}>
//                 Swap
//           </Menu.Item>
//             <Menu.Item>
//                 Report
//           </Menu.Item>
//         </Menu>
//     );

//     if(res.loading) {
//         return <div></div>
//     }

//     if(!res.loading && res.data && !loading1) {
//         setData(res.data.getCommentsByPostID)
//         setLoading1(true)
//     }

//     return (
//         <div>
//             {!res.loading && data && data.length ? <GridLayout className="layout" layout={layout} rowHeight={12} width={500}>
//                 {data.map((item1, index) =>
//                     <div key={index.toString()}>
//                         {
//                             item1.type === "video" ?
//                                 <ReactPlayer url={item1.url} height={"40px"} playing={false} muted width="125%" />
//                                 :
//                                 <img src={item1.url} alt="" style={{ height: "40px", width: "40px" }} />
//                         }
//                     </div>
//                 )}

//                 <div key="n" style={{ textAlign: "center" }}>
//                     <img src={item.thumbnail_url} alt="" style={{ height: "128px", width: "100%", marginLeft: "5px" }} />
//                 </div>

//             </GridLayout> : 
//             <img src={item.thumbnail_url} alt=""  />
//             }
//         </div>
//     )
// }

// export default Thumbnail
// import React, { useState } from "react";
// import GridLayout from 'react-grid-layout';
// import ReactPlayer from 'react-player'
// import { useQuery } from "@apollo/client";
// import "react-grid-layout/css/styles.css"
// import { getCommentsByPostID } from "../../../graphql/queries/comments";

// const Thumbnail = ({ item }) => {
//     const [loading1, setLoading1] = useState(false)
//     const res = useQuery(getCommentsByPostID, { variables: { id: item.id, skip: 0, limit: 12 } })

//     // layout is an array of objects
//     const layout = [
//         { i: "0", x: 0, y: 0, w: 1, h: 2, static: true },
//         { i: "1", x: 1, y: 0, w: 1, h: 2, static: true },
//         { i: "2", x: 2, y: 0, w: 1, h: 2, static: true },
//         { i: "3", x: 3, y: 0, w: 1, h: 2, static: true },
//         { i: "4", x: 4, y: 0, w: 1, h: 2, static: true },
//         { i: "5", x: 5, y: 0, w: 1, h: 2, static: true },
//         { i: "6", x: 6, y: 0, w: 1, h: 2, static: true },
//         { i: "7", x: 6, y: 2, w: 1, h: 2, static: true },
//         { i: "8", x: 6, y: 4, w: 1, h: 2, static: true },
//         { i: "9", x: 6, y: 6, w: 1, h: 2, static: true },
//         { i: "10", x: 0, y: 2, w: 1, h: 2, static: true },
//         { i: "11", x: 0, y: 4, w: 1, h: 2, static: true },
//         { i: "12", x: 0, y: 6, w: 1, h: 2, static: true },
//         { i: "n", x: 1, y: 2, w: 5, h: 6, static: true },
//     ];

//     const [data, setData] = useState([])

//     if (res.loading) {
//         return <div></div>
//     }

//     if (!res.loading && res.data && !loading1) {
//         setData(res.data.getCommentsByPostID)
//         setLoading1(true)
//     }

//     return (
//         <div>
//             {!res.loading && data && data.length ? <GridLayout className="layout" layout={layout} rowHeight={12} width={500}>
//                 {data.map((item1, index) =>
//                     <div key={index.toString()}>
//                         {
//                             item1.type === "video" ?
//                                 <ReactPlayer url={item1.url} height={"40px"} playing={false} muted width="125%" />
//                                 :
//                                 <img src={item1.url} alt="" style={{ height: "40px", width: "100%" }} />
//                         }
//                     </div>
//                 )}

//                 <div key="n" style={{ textAlign: "center" }}>

//                     <img src={item.thumbnail_url} alt="" style={{ height: "128px", width: "100%", marginLeft: "5px" }} />

//                 </div>

//             </GridLayout> :
//                 <img src={item.thumbnail_url} alt="" />
//             }
//         </div>
//     )
// }

// export default Thumbnail

import React, { useState } from "react";
import GridLayout from 'react-grid-layout';
import ReactPlayer from 'react-player'
import { useQuery } from "@apollo/client";
import "react-grid-layout/css/styles.css"
import { getCommentsByPostID } from "../../../graphql/queries/comments";

const Thumbnail = ({ item }) => {
    const [loading1, setLoading1] = useState(false)
    const res = useQuery(getCommentsByPostID, { variables: { id: item.id, page_no: 0 } })

    // layout is an array of objects
    const layout = [
        { i: "0", x: 0, y: 0, w: 1, h: 2, static: true },
        { i: "1", x: 1, y: 0, w: 1, h: 2, static: true },
        { i: "2", x: 2, y: 0, w: 1, h: 2, static: true },
        { i: "3", x: 3, y: 0, w: 1, h: 2, static: true },
        { i: "4", x: 4, y: 0, w: 1, h: 2, static: true },
        { i: "5", x: 5, y: 0, w: 1, h: 2, static: true },
        { i: "6", x: 6, y: 0, w: 1, h: 2, static: true },
        { i: "7", x: 6, y: 2, w: 1, h: 2, static: true },
        { i: "8", x: 6, y: 4, w: 1, h: 2, static: true },
        { i: "9", x: 6, y: 6, w: 1, h: 2, static: true },
        { i: "10", x: 0, y: 2, w: 1, h: 2, static: true },
        { i: "11", x: 0, y: 4, w: 1, h: 2, static: true },
        { i: "12", x: 0, y: 6, w: 1, h: 2, static: true },
        { i: "n", x: 1, y: 2, w: 5, h: 6, static: true },
    ];

    const [data, setData] = useState([])

    if (res.loading) {
        return <div></div>
    }

    if (!res.loading && res.data && !loading1) {
        setData(res.data.getCommentsByPostID)
        setLoading1(true)
    }

    return (
        <div>
            <img src={item.snippet.thumbnails.medium.url} alt="" style={{  height: item.snippet.thumbnails.medium.height, width: item.snippet.thumbnails.medium.width }}/>
        </div>
    )
}

export default Thumbnail