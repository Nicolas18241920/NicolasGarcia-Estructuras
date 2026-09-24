import React, { useState } from 'react';
import Tree from 'react-d3-tree';

// ==========================================
// 1. & 2. LÓGICA DEL ÁRBOL BINARIO DE BÚSQUEDA
// ==========================================

class Node {
  constructor(value) {
    this.value = value;
    this.left = null;
    this.right = null;
  }
}

class BinarySearchTree {
  constructor() {
    this.root = null;
  }

  // Insertar un nuevo valor
  insert(value) {
    const newNode = new Node(value);
    if (this.root === null) {
      this.root = newNode;
      return this;
    }
    let current = this.root;
    while (true) {
      if (value === current.value) return undefined; // Evitar duplicados
      if (value < current.value) {
        if (current.left === null) {
          current.left = newNode;
          return this;
        }
        current = current.left;
      } else {
        if (current.right === null) {
          current.right = newNode;
          return this;
        }
        current = current.right;
      }
    }
  }

  // Comprobar si un valor existe en el árbol (Punto 2)
  contains(value) {
    if (this.root === null) return false;
    let current = this.root;
    let found = false;
    while (current && !found) {
      if (value < current.value) {
        current = current.left;
      } else if (value > current.value) {
        current = current.right;
      } else {
        return true;
      }
    }
    return false;
  }

  // Recorridos (Punto 1)
  inOrder() {
    let data = [];
    function traverse(node) {
      if (node.left) traverse(node.left);
      data.push(node.value);
      if (node.right) traverse(node.right);
    }
    if (this.root) traverse(this.root);
    return data;
  }

  preOrder() {
    let data = [];
    function traverse(node) {
      data.push(node.value);
      if (node.left) traverse(node.left);
      if (node.right) traverse(node.right);
    }
    if (this.root) traverse(this.root);
    return data;
  }

  postOrder() {
    let data = [];
    function traverse(node) {
      if (node.left) traverse(node.left);
      if (node.right) traverse(node.right);
      data.push(node.value);
    }
    if (this.root) traverse(this.root);
    return data;
  }
}

// Adaptador para convertir el formato del BST al formato de react-d3-tree
const formatTreeForD3 = (node) => {
  if (!node) return null;

  let children = [];
  if (node.left || node.right) {
    if (node.left) {
      children.push(formatTreeForD3(node.left));
    } else {
      children.push({ name: '∅', attributes: { hidden: true } });
    }

    if (node.right) {
      children.push(formatTreeForD3(node.right));
    } else {
      children.push({ name: '∅', attributes: { hidden: true } });
    }
  }

  return {
    name: String(node.value),
    children: children.length > 0 ? children : undefined
  };
};

// ==========================================
// 3. COMPONENTE REACT (UI y react-d3-tree)
// ==========================================

export default function Challenge08() {
  const [bst] = useState(new BinarySearchTree());
  const [treeData, setTreeData] = useState(null);

  const [insertValue, setInsertValue] = useState('');
  const [searchValue, setSearchValue] = useState('');
  const [searchResult, setSearchResult] = useState(null);

  const handleInsert = (e) => {
    e.preventDefault();
    const val = parseInt(insertValue, 10);
    if (!isNaN(val)) {
      bst.insert(val);
      setTreeData(formatTreeForD3(bst.root));
      setInsertValue('');
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const val = parseInt(searchValue, 10);
    if (!isNaN(val)) {
      const exists = bst.contains(val);
      setSearchResult(`El valor ${val} ${exists ? 'SÍ' : 'NO'} está en el árbol.`);
    }
  };

  const handlePrintTraversals = () => {
    console.log("----- RECORRIDOS DEL ÁRBOL -----");
    console.log("InOrder   (Izq-Raíz-Der):", bst.inOrder().join(" -> "));
    console.log("PreOrder  (Raíz-Izq-Der):", bst.preOrder().join(" -> "));
    console.log("PostOrder (Izq-Der-Raíz):", bst.postOrder().join(" -> "));
    console.log("--------------------------------");
    alert("Revisa la consola del navegador para ver los recorridos.");
  };

  const renderCustomNodeElement = ({ nodeDatum }) => (
    <g style={{ visibility: nodeDatum.attributes?.hidden ? 'hidden' : 'visible' }}>
      <circle r="20" fill="#319795" />
      <text fill="white" strokeWidth="1" x="-10" y="5">
        {nodeDatum.name}
      </text>
    </g>
  );

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h2>Challenge 08 - Binary Search Tree</h2>
      
      <div style={{ display: 'flex', gap: '20px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <form onSubmit={handleInsert} style={formStyle}>
          <h3>1. Insertar Nodo</h3>
          <input type="number" value={insertValue} onChange={(e) => setInsertValue(e.target.value)} placeholder="Número" style={inputStyle} />
          <button type="submit" style={btnStyle}>Insertar</button>
        </form>

        <form onSubmit={handleSearch} style={formStyle}>
          <h3>2. Buscar Valor</h3>
          <input type="number" value={searchValue} onChange={(e) => setSearchValue(e.target.value)} placeholder="Número a buscar" style={inputStyle} />
          <button type="submit" style={btnStyle}>Verificar</button>
          {searchResult && <p style={{ marginTop: '10px', fontWeight: 'bold' }}>{searchResult}</p>}
        </form>

        <div style={formStyle}>
          <h3>3. Imprimir Recorridos</h3>
          <button onClick={handlePrintTraversals} style={{...btnStyle, backgroundColor: '#d69e2e'}}>Imprimir en Consola</button>
        </div>
      </div>

      <div style={{ height: '500px', border: '2px dashed #cbd5e0', backgroundColor: '#f7fafc' }}>
        {treeData ? (
          <Tree 
            data={treeData} 
            orientation="vertical"
            pathFunc="straight"
            translate={{ x: 300, y: 50 }}
            renderCustomNodeElement={renderCustomNodeElement}
          />
        ) : (
          <div style={{ display: 'flex', height: '100%', alignItems: 'center', justifyContent: 'center', color: '#a0aec0' }}>
            <h2>El árbol está vacío. Inserta números.</h2>
          </div>
        )}
      </div>
    </div>
  );
}

const formStyle = { flex: '1', padding: '20px', backgroundColor: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px' };
const inputStyle = { padding: '8px', marginRight: '10px', width: '120px' };
const btnStyle = { padding: '8px 16px', backgroundColor: '#319795', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' };