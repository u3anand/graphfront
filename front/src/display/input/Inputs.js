import React, {useState, useEffect} from 'react'
import InputGraph from './InputGraph'
import { Button, Modal, Checkbox, Input, Form, InputNumber } from 'antd';
import {UserOutlined} from '@ant-design/icons'
import Profile from './Profile.js'



// Will Refactor Soon



export default function Inputs(props) {
    const [showProperties, setShowProperties] = useState(false);
    const [showInput, setShowInput] = useState(false);
    const [properties, setProperties] = useState([{"id": "cycles", "value": "5"}]);

    const [editEdge, setEditEdge] = useState(false);
    const [deleteEdge, setDeleteEdge] = useState(false);
    const [addEdge, setAddEdge] = useState(false);
    const [addEdgeValidStatus1, setAddEdgeValidStatus1] = useState("none");
    const [addEdgeValidStatus2, setAddEdgeValidStatus2] = useState("none");

    const [v1, setV1] = useState("");
    const [v2, setV2] = useState("");

    const [verticesInput, setVerticesInput] = useState(1);
    const [vertices, setVertices] = useState(0);
    const [vertexMessage, setVertexMessage] = useState();
    const [edges, setEdges] = useState();
    const [edgesMessage, setEdgesMessage] = useState();

    const [profileModal, setProfileModal] = useState(false);

    const options1 = ["Components", "Hamiltonian Cycles"];
    const options2 = ["Spanning Trees", "Euler Tours"];
    const options3 = ["Planarity", "Longest/Shortest Cycles"];

    const addVertices = () => {
        setVertices(verticesInput);
        let k = Array(verticesInput);
        k.fill([]);
        setEdges(k);
        let m = Array(verticesInput);
        m.fill("none")
        setEdgesMessage(m);
    }

    const addEdges = () => {
        let inputGraph = new InputGraph(vertices, edges);
        console.log(vertices, edges);
        console.log(inputGraph.valid);
        console.log(inputGraph.errors);
        if(inputGraph.valid === true) {
            props.setVertices(inputGraph.vertices);
            props.setEdges(inputGraph.edges);
            props.setBendPositions(inputGraph.bendPositions)
            clearInput();
        } else {
            setEdgesMessage(inputGraph.errors);
        }
    }

    const clearInput = () => {
        setVertices(0);
        setShowInput(false); 
        setVertexMessage("none");
        setEdges();
        setEdgesMessage();
    }

    const getGraphInput = () => {
        const footer = (
            <React.Fragment>
                <Button key="back" onClick={() => {clearInput()}}>
                    Cancel
                </Button>
                <Button type="primary" onClick={() => {
                        vertices === 0 ? addVertices() : addEdges();
                    }
                }>
                    {vertices === 0 ? "Continue" : "Input Graph"}
                </Button>
            </React.Fragment>
        )

        const hasVertexCount = () => {
            if(vertices === 0) {
                return (
                    <Form.Item
                        label="Number of Vertices (Max 20)"
                        name="v1"
                        validateStatus={addEdgeValidStatus1}
                        help={vertexMessage === "error" ? "Invalid Input" : null}
                    >
                        <InputNumber onPressEnter={(e) => {setVertices(verticesInput)}} autoComplete="off" onChange={(value) => setVerticesInput(value)} 
                                    min={1} max={20} defaultValue={1}/>
                    </Form.Item>
                )
            } else {
                let k = [];
                for(let i = 0; i < vertices; ++i) {
                    k.push(
                        <Form.Item
                            validateStatus={edgesMessage[i]}
                            help={edgesMessage[i] === "error" ? "Invalid Input" : null}
                            label={JSON.stringify(i)}
                        >
                            <Input defaultValue="" style={{width:"70px", margin:"2px"}} onPressEnter={(e) => {addEdges()}} autoComplete="off" onChange={(e) => 
                                    {let newEdges = [...edges]; newEdges[i] = (e.target.value).split(" ").join("").split(","); setEdges(newEdges);}} />
                        </Form.Item>
                    )
                }
                return (
                    <React.Fragment>
                        <div style={{marginTop:"-15px", marginBottom:"35px"}}>Edges (adjacency list, seperating neighbors of each vertex with commas)</div>
                        <div style={{display:"flex", width:"350px", marginLeft:"auto", marginRight:"auto", flexWrap:"wrap", justifyContent:"space-around"}}>
                            {k}
                        </div>
                    </React.Fragment>
                )
            }
        }

        return (
            <Modal style={{top: "10%"}} title="Input Graph" visible={showInput} onCancel={() => {clearInput()}} footer={footer}>
                 <div style={{display:"flex", width:"100%", justifyContent:"center", marginTop:"10px", marginBottom:"-5px", marginLeft:"-10px"}}>
                    <Form
                        onMouseDown={() => {setAddEdgeValidStatus1("none")}}
                        >
                        {hasVertexCount()}
                    </Form>
                 </div>
            </Modal>
        )
    }

    const getProperties = () => {
        let content;
        let footer;
        if(properties.length > 0) {
            const data = properties.map((item) => {
                return <p>{item.id + " " + item.value}</p>
            })

            content = (
                <React.Fragment>
                    {data}
                </React.Fragment>
            )

            footer = (
                <React.Fragment>
                    <Button type="primary" style={{marginRight:"32%"}} onClick={() => setProperties([])}>Generate Different Properties</Button>
                    <Button key="back" onClick={() => {setShowProperties(false)}}>
                        Return
                    </Button>
                    <Button key="submit" type="primary" onClick={() => {setShowProperties(false)}}>
                        Confirm
                    </Button>
                </React.Fragment>
            )
        } else {
            content = (
                <div style={{display:"flex", justifyContent:"center"}}>
                    <Checkbox.Group style={{display:"flex", width:"180px", flexWrap:"wrap"}} options={options1} />
                    <Checkbox.Group style={{display:"flex", width:"180px", flexWrap:"wrap"}} options={options2} />
                    <Checkbox.Group style={{display:"flex", width:"180px", flexWrap:"wrap"}} options={options3} />
                </div>
            )
        }
        return (
            <Modal style={{top: "25%"}} width={"600px"} bodyStyle={{minHeight:"200px"}} title="Graph Properties" visible={showProperties} onOk={() => {setShowProperties(false)}} onCancel={() => {setShowProperties(false)}}
                    footer={footer}>
                {content}
            </Modal>
        )
    }

    const addOrDeleteEdge = (bool) => {
        if(v1 !== "" && v2 !== "") {
            let success;
            if(bool) {
                success = props.addEdge(v1, v2);
            } else {
                success = props.deleteEdge(v1, v2);
            }
            setAddEdgeValidStatus1(success[0]);
            setAddEdgeValidStatus2(success[1]);
            return success;
        } else {
            let k = [];
            if(v1 === "") {
                k.push("error")
            } else {
                k.push("none")
            }

            if(v2 === "") {
                k.push("error")
            } else {
                k.push("none");
            }
            setAddEdgeValidStatus1(k[0]);
            setAddEdgeValidStatus2(k[1]);
            return k;
        }
    }

    const getEditEdge = () => {
        const footer = (
            <React.Fragment>
                <Button key="back" onClick={() => {setEditEdge(false); setAddEdge(false); setDeleteEdge(false)}}>
                    Return
                </Button>
                <Button type="primary" onClick={() => {
                        addEdge ? addOrDeleteEdge(true) : addOrDeleteEdge(false)
                    }
                }>
                    {addEdge ? "Add Edge" : "Delete Edge"}
                </Button>
            </React.Fragment>
        )

        return (
            <Modal style={{top: "25%"}} title={addEdge ? "Add Edge" : "Delete Edge"} visible={editEdge} onCancel={() => {setEditEdge(false); setAddEdge(false); setDeleteEdge(false);
                    setAddEdgeValidStatus1("none"); setAddEdgeValidStatus2("none")}} footer={footer}>
                 <div style={{display:"flex", width:"100%", justifyContent:"center", marginTop:"10px", marginBottom:"-5px", marginLeft:"-10px"}}>
                    <Form
                        initialValues={{ remember: true }}
                        onMouseDown={() => {setAddEdgeValidStatus1("none"); console.log("?")
                        setAddEdgeValidStatus2("none")}}
                        >
                        <Form.Item
                            label="Vertex 1"
                            name="v1"
                            validateStatus={addEdgeValidStatus1}
                            help={addEdgeValidStatus1 === "error" ? "Invalid Input" : null}
                        >
                            <Input onPressEnter={(e) => {addEdge ? addOrDeleteEdge(true) : addOrDeleteEdge(false)}} autoComplete="off" onChange={(e) => setV1(e.target.value)} />
                        </Form.Item>
                        <Form.Item
                            validateStatus={addEdgeValidStatus2}
                            help={addEdgeValidStatus2 === "error" ? "Invalid Input" : null}
                            label="Vertex 2"
                            name="v2"
                        >
                            <Input onPressEnter={(e) => {addEdge ? addOrDeleteEdge(true) : addOrDeleteEdge(false)}} autoComplete="off" onChange={(e) => setV2(e.target.value)} />
                        </Form.Item>
                    </Form>
                 </div>
            </Modal>
        )
    }

    return (
        <React.Fragment>
            <div style={{position:"absolute", display:"flex", marginTop:"20px", marginLeft:"20px"}} >
                <Button style={{margin: "8px", height:"35px", width:"150px", fontSize:"15px"}} type="primary" onClick={() => setShowInput(true)}>Input Graph</Button>
                <Button style={{margin: "8px", height:"35px", width:"150px", fontSize:"15px"}} type="primary" onClick={() => {props.straightenEdges()}}>Straighten Edges</Button>
                <Button style={{margin: "8px", height:"35px", width:"150px", fontSize:"15px"}} type="primary" onClick={() => setShowProperties(true)}>Graph Properties</Button>
                <Button style={{margin: "8px", height:"35px", width:"150px", fontSize:"15px"}} type="primary" onClick={() => props.centerGraph()}>Center Graph</Button>
            </div>
            <div style={{position:"absolute", marginLeft:"25px", bottom:"calc(6vh + 15px)"}}>
                <Button style={{width:"55px", height:"45px"}} type="primary" onClick={() => setProfileModal(true)}>
                    <UserOutlined style={{}}/>
                </Button>
            </div>
            <Profile modal={profileModal} setModal={setProfileModal} loggedIn={props.loggedIn} logIn={props.logIn} logOut={props.logOut}
                    edges={props.edges} vertices={props.vertices} bendPositions={props.bendPositions} setEdges={props.setEdges} setVertices={props.setVertices}
                    setBendPositions={props.setBendPositions}
                    />
            {getGraphInput()}
            {getProperties()}
            {getEditEdge()}
            <div style={{position:"absolute", display:"flex", right:"3%", bottom:"6%", flexWrap:"wrap", width:"125px"}}>
                <Button style={{margin:"8px", height:"45px", width:"95px", fontSize:"15px", padding:"0px"}} type="primary" 
                        onClick={() => {setDeleteEdge(true); setEditEdge(true);}}>
                    Delete Edge
                </Button>
                <Button style={{margin:"8px", height:"45px", width:"95px", fontSize:"15px", padding:"0px"}} type="primary" 
                        onClick={() => {props.setDeletingVertex(true)}}>
                    Delete Node
                </Button>
                <Button style={{margin:"8px", height:"45px", width:"95px", fontSize:"15px", padding:"0px"}} type="primary" 
                    onClick={() => {setAddEdge(true); setEditEdge(true)}}>
                    Add Edge
                </Button>
                <Button style={{margin:"8px", height:"45px", width:"95px", fontSize:"15px", padding:"0px"}} type="primary" 
                    onClick={() => {props.setAddingVertex(true)}}>
                    Add Node
                </Button>
            </div>
        </React.Fragment>
    )
}
