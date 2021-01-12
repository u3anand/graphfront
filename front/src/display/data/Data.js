import React, {useEffect, useState} from 'react'
import Inputs from '../../display/input/Inputs.js'
import GraphVisual from '../graphs/GraphVisual.js'

export default function Data(props) {
    const [vertices, setVertices] = useState([{
            "id": 0,
            "posX": 850,
            "posY": 200
        }, {
            "id": 1,
            "posX": 1150,
            "posY": 400
        }, {
            "id": 2,
            "posX": 550,
            "posY": 400
        }, {
            "id": 3,
            "posX": 1050,
            "posY": 720
        }, {
            "id": 4,
            "posX": 650,
            "posY": 720
        }
    ])

    const edgesArray = [{
        "id": "0.1",
        "node1": 0,
        "node2": 1,
        "bent": false,
        "posX": null,
        "posY": null
    }, {
        "id": "1.2",
        "node1": 1,
        "node2": 2,
        "bent": false,
        "posX": null,
        "posY": null
    }, {
        "id": "1.3",
        "node1": 1,
        "node2": 3,
        "bent": false,
        "posX": null,
        "posY": null
    }, {
        "id": "0.2",
        "node1": 0,
        "node2": 2,
        "bent": false,
        "posX": null,
        "posY": null
    }, {
        "id": "0.3",
        "node1": 0,
        "node2": 3,
        "bent": false,
        "posX": null,
        "posY": null
    }, {
        "id": "2.3",
        "node1": 2,
        "node2": 3,
        "bent": false,
        "posX": null,
        "posY": null
    }, {
        "id": "0.4",
        "node1": 0,
        "node2": 4,
        "bent": false,
        "posX": null,
        "posY": null
    }, {
        "id": "1.4",
        "node1": 1,
        "node2": 4,
        "bent": false,
        "posX": null,
        "posY": null
    }, {
        "id": "2.4",
        "node1": 2,
        "node2": 4,
        "bent": false,
        "posX": null,
        "posY": null
    }, {
        "id": "3.4",
        "node1": 3,
        "node2": 4,
        "bent": false,
        "posX": null,
        "posY": null
    }]

    let edgesMap = new Map();
    let bdMap = new Map();

    edgesArray.forEach(edge => {
        edgesMap.set(edge.node1 + "." + edge.node2, edge);
        bdMap.set(edge.node1 + "." + edge.node2, {"id": edge.id, "bent":edge.bent, "posX": edge.posX, "posY":edge.posY});
    })

    const [edges, setEdges] = useState(edgesMap);
    const [addingVertex, setAddingVertex] = useState(false);
    const [deletingVertex, setDeletingVertex] = useState(false);
    const [bendPositions, setBendPositions] = useState(bdMap);

    const tryAddVertex = (e) => {
        if(addingVertex && vertices.length <= 30) {
            addVertex(e.clientX - 45, e.clientY - 10)
        }
        setAddingVertex(false);
    }

    const addVertex = (x, y) => {
        vertices.push({"id": vertices.length, "posX": x, "posY":y});
    }

    const straightenEdges = () => {
        edges.forEach(edge => {
            bdMap.set(edge.node1 + "." + edge.node2, {"id": edge.id, "bent":false, "posX": 0, "posY": 0});
        })

        setBendPositions(bdMap);
    }

    const deleteVertex = (idx) => {
        let newEdges = new Map();
        let newBendPositions = new Map();
        edges.forEach((v) => {
            let key = v.id;
            let substr1 = Number(key.substr(0, key.indexOf('.')));
            let substr2 = Number(key.substr(key.indexOf('.') + 1, key.length - 1));

            if(substr1 !== idx && substr2 !== idx) {
                if(substr1> idx) --substr1;
                if(substr2 > idx) --substr2;

                let newKey = substr1 + "." + substr2;
                let newVal = v;
                newVal["id"] = newKey;
                newVal["node1"] = substr1;
                newVal["node2"] = substr2;
                let newBendVal = bendPositions.get(key);
                newBendVal["id"] = newKey;

                newEdges.set(substr1 + "." + substr2, newVal);
                newBendPositions.set(substr1 + "." + substr2, newBendVal);
            }
        })
        setEdges(newEdges);
        setBendPositions(newBendPositions);
        setDeletingVertex(false);
        deleteVertexHelper(idx)
    }

    const deleteVertexHelper = (idx) => {
        let k = vertices;
        k.splice(idx, 1);
        for(let i = idx; i < k.length; ++i) {
            --k[i].id;
        }
        setVertices(k);
    }

    const deleteEdge = (key) => {
        let k = new Map(edges);
        k.delete(key);
        let b = new Map(bendPositions);
        b.delete(key);
        setEdges(k);
        setBendPositions(b);
    }

    const addEdge = (v1, v2) => {
        let valid = ["none", "none"];
        v1 = Number(v1);
        v2 = Number(v2);
        if(!(Number.isInteger(v1)) || v1 > vertices.length - 1) {
            valid[0] = ("error");
        }
        if(!(Number.isInteger(v2)) || v2 > vertices.length - 1) {
            valid[1] = "error";
        }
        if(v1 === v2) {
            valid[0] = "error";
            valid[1] = "error";
        }
        if(valid[0] === "error" || valid[1] === "error") {
            return valid;
        }
        let key;
        if(v1 > v2) {
            key = v2 + "." + v1;
        } else {
            key = v1 + "." + v2;
        }
        if(edges.has(key)) {
            return ["error", "error"]
        } else {
            setEdges(new Map(edges.set(key, {
                "id": key,
                "node1": v1,
                "node2": v2,
                "bent": false,
                "posX": null,
                "posY": null
            })));


            setBendPositions(new Map(bendPositions.set(key, {
                "id": key,
                "bent": false,
                "posX": null,
                "posY": null
            })));

            return ["success", "success"];
        }
    }

    const deleteEdgeTest = (v1, v2) => {
        let valid = ["none", "none"];
        v1 = Number(v1);
        v2 = Number(v2);

        if(!(Number.isInteger(v1)) || v1 > vertices.length - 1) valid[0] = ("error");
        
        if(!(Number.isInteger(v2)) || v2 > vertices.length - 1) valid[1] = "error";
        
        if(v1 === v2) {
            valid[0] = "error";
            valid[1] = "error";
        }

        if(valid[0] === "error" || valid[1] === "error") return valid;
        let key;

        if(v1 > v2) {
            key = v2 + "." + v1;
        } else {
            key = v1 + "." + v2;
        }
        if(!edges.has(key)) {
            return ["error", "error"]
        } else {
            deleteEdge(key);
            return ["success", "success"];
        }
    }

    const centerGraph = () => {
        let newVertices = [];
        vertices.forEach(vertex => {
            console.log(vertex);
            vertex.posX = 750;
            vertex.posY = 420;

            newVertices.push(vertex);
        })

        setVertices(newVertices);
        straightenEdges();
    }

    useEffect(() => {}, [edges])
        
    return (
        <div style={{overflow:"auto"}}>
            <div style={{display:"flex", height: '92vh', width:'94vw', marginLeft:"3vw", marginRight:"3vw", marginTop:"3vh", marginBottom:"2.75vh", overflow:"hidden"}} 
                onMouseDown={(e) => {tryAddVertex(e); setAddingVertex(false)}}>
                <Inputs setAddingVertex={setAddingVertex} straightenEdges={straightenEdges} addEdge={addEdge} setDeletingVertex={setDeletingVertex} deleteEdge={deleteEdgeTest}
                        setVertices={setVertices} setEdges={setEdges} setBendPositions={setBendPositions} edges={edges} vertices={vertices} bendPositions={bendPositions}
                        logIn={props.login} logOut={props.logout} loggedIn={props.loggedIn} centerGraph={centerGraph}
                />
                <GraphVisual vertices={vertices} edges={edges} bendPositions={bendPositions} setVertices={setVertices} deletingVertex={deletingVertex}
                            setBendPositions={setBendPositions} onMouseDown={(e) => {tryAddVertex(e); setAddingVertex(false)}} deleteVertex={deleteVertex}/>
            </div>
        </div>
    )
}
