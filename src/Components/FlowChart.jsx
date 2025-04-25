import React, { useState, useCallback, useRef } from 'react';
import ReactFlow, {
  ReactFlowProvider,
  addEdge,
  useNodesState,
  useEdgesState,
  Controls,
  Background,
  Handle,
  Position,
} from 'reactflow';
import 'reactflow/dist/style.css';
import styled from 'styled-components';

const FlowChartContainer = styled.div`
  height: 100%;
  width: 100%;
  background-color: ${props => props.darkMode ? '#333' : '#f8f8f8'};
  color: ${props => props.darkMode ? '#fff' : '#333'};
`;

const ProductNode = ({ data }) => {
  return (
    <div style={{ 
      padding: '10px', 
      borderRadius: '5px', 
      background: data.darkMode ? '#555' : '#fff',
      border: '1px solid #ddd',
      color: data.darkMode ? '#fff' : '#333',
      position: 'relative',
      width: '200px',
      height: 'auto',
    }}>
      <Handle
        type="target"
        position={Position.Top}
        style={{ 
          background: data.darkMode ? '#aaa' : '#555',
          width: '10px',
          height: '10px'
        }}
      />
      
      {data.onDelete && (
        <button 
          style={{
            position: 'absolute',
            top: '5px',
            right: '5px',
            background: data.darkMode ? '#777' : '#eee',
            border: 'none',
            borderRadius: '50%',
            width: '20px',
            height: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: data.darkMode ? '#fff' : '#333',
          }}
          onClick={data.onDelete}
        >
          ×
        </button>
      )}
      
      {data.images && data.images.length > 0 && (
        <div style={{ marginBottom: '8px', textAlign: 'center' }}>
          <img 
            src={data.images[0]} 
            alt={data.name} 
            style={{ 
              maxWidth: '100%', 
              maxHeight: '80px', 
              objectFit: 'contain',
              borderRadius: '3px'
            }} 
          />
        </div>
      )}
      
      <div><strong>{data.name}</strong></div>
      <div>${data.price}</div>
      
      <Handle
        type="source"
        position={Position.Bottom}
        style={{ 
          background: data.darkMode ? '#aaa' : '#555',
          width: '10px',
          height: '10px'
        }}
      />
    </div>
  );
};

const CustomEdge = ({ id, sourceX, sourceY, targetX, targetY, data }) => {
  const midX = (sourceX + targetX) / 2;
  const midY = (sourceY + targetY) / 2;
  const darkMode = data?.darkMode;
  
  return (
    <>
      <path
        d={`M ${sourceX} ${sourceY} L ${targetX} ${targetY}`}
        stroke={darkMode ? '#aaa' : '#555'}
        strokeWidth={2}
        fill="none"
        markerEnd={`url(#arrow-${darkMode ? 'dark' : 'light'})`}
      />
      
      <circle
        cx={midX}
        cy={midY}
        r={8}
        fill={darkMode ? '#555' : '#fff'}
        stroke={darkMode ? '#aaa' : '#555'}
        strokeWidth={1}
        onClick={() => data?.onDelete(id)}
        style={{ cursor: 'pointer' }}
      />
      <text
        x={midX}
        y={midY}
        textAnchor="middle"
        dominantBaseline="central"
        fill={darkMode ? '#fff' : '#555'}
        fontSize={10}
        onClick={() => data?.onDelete(id)}
        style={{ cursor: 'pointer', userSelect: 'none' }}
      >
        ×
      </text>
    </>
  );
};

const nodeTypes = {
  productNode: ProductNode,
};

const edgeTypes = {
  custom: CustomEdge,
};

const FlowChart = ({ darkMode, toggleDarkMode }) => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [reactFlowInstance, setReactFlowInstance] = useState(null);
  const reactFlowWrapper = useRef(null);
  
  const [undoStack, setUndoStack] = useState([]);
  const [redoStack, setRedoStack] = useState([]);

  const saveToHistory = () => {
    const currentState = {
      nodes: JSON.parse(JSON.stringify(nodes)),
      edges: JSON.parse(JSON.stringify(edges))
    };
    
    setUndoStack(prev => [...prev, currentState]);
    setRedoStack([]);
  };

const undo = () => {
    if (undoStack.length === 0) return;
    
    const newUndoStack = [...undoStack];
    const prevState = newUndoStack.pop();
    
    const currentState = {
      nodes: JSON.parse(JSON.stringify(nodes)),
      edges: JSON.parse(JSON.stringify(edges))
    };
    
    setRedoStack(prev => [...prev, currentState]);
    setUndoStack(newUndoStack);
    
    const nodesWithHandlers = prevState.nodes.map(node => {
      if (node.type === 'productNode') {
        return {
          ...node,
          data: {
            ...node.data,
            darkMode: darkMode,
            onDelete: () => deleteNode(node.id)
          }
        };
      }
      return node;
    });
    
    const edgesWithHandlers = prevState.edges.map(edge => ({
      ...edge,
      data: {
        ...edge.data,
        darkMode: darkMode,
        onDelete: deleteEdge
      }
    }));
    
    setNodes(nodesWithHandlers);
    setEdges(edgesWithHandlers);
  };
  
  const redo = () => {
    if (redoStack.length === 0) return;
    
    const newRedoStack = [...redoStack];
    const nextState = newRedoStack.pop();
    
    const currentState = {
      nodes: JSON.parse(JSON.stringify(nodes)),
      edges: JSON.parse(JSON.stringify(edges))
    };
    
    setUndoStack(prev => [...prev, currentState]);
    setRedoStack(newRedoStack);
    
    const nodesWithHandlers = nextState.nodes.map(node => {
      if (node.type === 'productNode') {
        return {
          ...node,
          data: {
            ...node.data,
            darkMode: darkMode,
            onDelete: () => deleteNode(node.id)
          }
        };
      }
      return node;
    });
    
    const edgesWithHandlers = nextState.edges.map(edge => ({
      ...edge,
      data: {
        ...edge.data,
        darkMode: darkMode,
        onDelete: deleteEdge
      }
    }));
    
    setNodes(nodesWithHandlers);
    setEdges(edgesWithHandlers);
  };
  

  const onConnect = (params) => {
    saveToHistory();
    setEdges(eds => 
      addEdge({
        ...params,
        id: `edge-${Date.now()}`,
        type: 'custom',
        animated: true,
        data: {
          darkMode: darkMode,
          onDelete: deleteEdge
        }
      }, eds)
    );
  };

  const deleteEdge = (edgeId) => {
    saveToHistory();
    setEdges(eds => eds.filter(edge => edge.id !== edgeId));
  };

  const deleteNode = (nodeId) => {
    saveToHistory();
    setNodes(nds => nds.filter(node => node.id !== nodeId));
    setEdges(eds => eds.filter(edge => 
      edge.source !== nodeId && edge.target !== nodeId
    ));
  };

  const onKeyDown = (event) => {
    if (event.key === 'Delete' || event.key === 'Backspace') {
      const selectedNodes = nodes.filter(node => node.selected);
      const selectedEdges = edges.filter(edge => edge.selected);
      
      if (selectedNodes.length > 0 || selectedEdges.length > 0) {
        saveToHistory();
        
        if (selectedNodes.length > 0) {
          const nodeIds = selectedNodes.map(node => node.id);
          setNodes(nodes.filter(node => !node.selected));
          setEdges(edges.filter(edge => 
            !nodeIds.includes(edge.source) && !nodeIds.includes(edge.target)
          ));
        }
        
        if (selectedEdges.length > 0) {
          setEdges(edges.filter(edge => !edge.selected));
        }
      }
    } else if ((event.ctrlKey || event.metaKey) && event.key === 'z') {
      event.preventDefault();
      undo();
    } else if ((event.ctrlKey || event.metaKey) && event.key === 'y') {
      event.preventDefault();
      redo();
    }
  };

  React.useEffect(() => {
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [nodes, edges]); 

  const onDragOver = (event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  };

  const onDrop = (event) => {
    event.preventDefault();

    const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
    const productData = JSON.parse(event.dataTransfer.getData('application/json'));
    
    if (!productData || !reactFlowInstance) {
      return;
    }

    const position = reactFlowInstance.project({
      x: event.clientX - reactFlowBounds.left,
      y: event.clientY - reactFlowBounds.top,
    });

    saveToHistory();
    
    const newNodeId = `product-${Date.now()}`;
    const newNode = {
      id: newNodeId,
      type: 'productNode',
      position,
      data: { 
        name: productData.title, 
        price: productData.price,
        images: productData.images,
        darkMode: darkMode,
        onDelete: () => deleteNode(newNodeId)
      },
    };

    setNodes(nds => [...nds, newNode]);
  };

  React.useEffect(() => {
    setNodes(nds => 
      nds.map(node => {
        if (node.type === 'productNode') {
          const nodeId = node.id;
          return {
            ...node,
            data: {
              ...node.data,
              darkMode: darkMode,
              onDelete: () => deleteNode(nodeId)
            }
          };
        }
        return node;
      })
    );

    setEdges(eds => 
      eds.map(edge => ({
        ...edge,
        data: {
          ...edge.data,
          darkMode: darkMode,
          onDelete: deleteEdge
        }
      }))
    );
  }, [darkMode]);

  return (
    <FlowChartContainer darkMode={darkMode}>
      <div style={{ position: 'absolute', right: '10px', top: '10px', zIndex: 4, display: 'flex', gap: '10px' }}>
        <button 
          onClick={undo} 
          disabled={undoStack.length === 0}
          style={{
            opacity: undoStack.length === 0 ? 0.5 : 1,
            cursor: undoStack.length === 0 ? 'not-allowed' : 'pointer',
            background: darkMode ? '#555' : '#eee',
            color: darkMode ? '#fff' : '#333',
            border: 'none',
            padding: '5px 10px',
            borderRadius: '4px'
          }}
        >
          Undo
        </button>
        <button 
          onClick={redo} 
          disabled={redoStack.length === 0}
          style={{
            opacity: redoStack.length === 0 ? 0.5 : 1,
            cursor: redoStack.length === 0 ? 'not-allowed' : 'pointer',
            background: darkMode ? '#555' : '#eee',
            color: darkMode ? '#fff' : '#333',
            border: 'none',
            padding: '5px 10px',
            borderRadius: '4px'
          }}
        >
          Redo
        </button>
        <button 
          onClick={toggleDarkMode}
          style={{
            background: darkMode ? '#555' : '#eee',
            color: darkMode ? '#fff' : '#333',
            border: 'none',
            padding: '5px 10px',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          {darkMode ? 'Light Mode' : 'Dark Mode'}
        </button>
      </div>
      <div style={{ width: '100%', height: '100%' }} ref={reactFlowWrapper}>
        <ReactFlowProvider>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={(changes) => {
              if (changes.some(change => change.type === 'position' && change.dragging === false)) {
                saveToHistory();
              }
              onNodesChange(changes);
            }}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onInit={setReactFlowInstance}
            onDrop={onDrop}
            onDragOver={onDragOver}
            nodeTypes={nodeTypes}
            edgeTypes={edgeTypes}
            fitView
          >
            <Controls />
            <Background 
              color={darkMode ? '#555' : '#aaa'} 
              gap={16} 
            />
            <svg style={{ position: 'absolute', top: 0, left: 0 }}>
              <defs>
                <marker
                  id="arrow-dark"
                  viewBox="0 0 10 10"
                  refX="5"
                  refY="5"
                  markerWidth="6"
                  markerHeight="6"
                  orient="auto-start-reverse"
                >
                  <path d="M 0 0 L 10 5 L 0 10 z" fill="#aaa" />
                </marker>
                <marker
                  id="arrow-light"
                  viewBox="0 0 10 10"
                  refX="5"
                  refY="5"
                  markerWidth="6"
                  markerHeight="6"
                  orient="auto-start-reverse"
                >
                  <path d="M 0 0 L 10 5 L 0 10 z" fill="#555" />
                </marker>
              </defs>
            </svg>
            <div style={{
              position: 'absolute',
              bottom: '10px',
              left: '10px',
              background: darkMode ? 'rgba(0,0,0,0.7)' : 'rgba(255,255,255,0.7)',
              padding: '10px',
              borderRadius: '5px',
              fontSize: '12px',
              color: darkMode ? '#fff' : '#333',
              padding:'40px',
            }}>
              <p><strong>How to create links:</strong> Drag from the bottom handle of one node to the top handle of another.</p>
              <p><strong>How to delete:</strong> Select node/link and press Delete, or click the × button.</p>
              <p><strong>Undo/Redo:</strong> Use Ctrl+Z / Ctrl+Y or the buttons above.</p>
            </div>
          </ReactFlow>
        </ReactFlowProvider>
      </div>
    </FlowChartContainer>
  );
};
export default FlowChart;

