import React, { useState, useEffect } from 'react';
import Tree from 'react-d3-tree';

// ==========================================
// ESTRUCTURA DEL ÁRBOL BINARIO (Lógica Pura)
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
      if (value === current.value) return undefined;
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

  // PUNTO 2: Función para comprobar si un valor existe en el árbol
  contains(value) {
    if (this.root === null) return false;
    let current = this.root;
    while (current) {
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

  // Recorridos (PUNTO 1)
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

// ==========================================
// ADAPTADOR PARA REACT-D3-TREE
// ==========================================
const formatTreeForD3 = (node) => {
  if (!node) return null;

  let children = [];
  if (node.left || node.right) {
    children.push(node.left ? formatTreeForD3(node.left) : { name: 'vacio-izq', attributes: { hidden: true } });
    children.push(node.right ? formatTreeForD3(node.right) : { name: 'vacio-der', attributes: { hidden: true } });
  }

  return {
    name: String(node.value),
    children: children.length > 0 ? children : undefined
  };
};

// ==========================================
// COMPONENTE PRINCIPAL (INTERFAZ)
// ==========================================
export default function App() {
  const [bst] = useState(new BinarySearchTree());
  const [treeData, setTreeData] = useState(null);

  const [searchValue, setSearchValue] = useState('');
  const [searchResult, setSearchResult] = useState(null);

  useEffect(() => {
    // PUNTO 1: Insertar una serie de números en un nuevo árbol al cargar
    const seriesOfNumbers = [20, 10, 30, 5, 15, 25, 35, 12, 18];
    seriesOfNumbers.forEach(num => bst.insert(num));

    // Convertir el árbol al formato que pide d3-tree (PUNTO 3)
    setTreeData(formatTreeForD3(bst.root));

    // PUNTO 1: Imprimir en consola los recorridos
    console.log("----- RECORRIDOS DEL ÁRBOL -----");
    console.log("Serie insertada:", seriesOfNumbers.join(", "));
    console.log("InOrder   :", bst.inOrder().join(" -> "));
    console.log("PreOrder  :", bst.preOrder().join(" -> "));
    console.log("PostOrder :", bst.postOrder().join(" -> "));
    console.log("--------------------------------");
  }, [bst]);

  // Ejecución del PUNTO 2 (Corregidas las comillas invertidas)
  const handleSearch = (e) => {
    e.preventDefault();
    const val = parseInt(searchValue, 10);
    if (!isNaN(val)) {
      const exists = bst.contains(val);
      setSearchResult(`El valor ${val} ${exists ? 'SÍ' : 'NO'} está en el árbol.`);
    }
  };

  // Renderizado personalizado de nodos (Agregados las etiquetas SVG circle y text)
  const renderCustomNodeElement = ({ nodeDatum }) => (
    <g style={{ visibility: nodeDatum.attributes?.hidden ? 'hidden' : 'visible' }}>
      <circle r="22" fill="#319795" />
      <text fill="white" strokeWidth="0.5" x="-8" y="5" fontSize="14" fontWeight="bold">
        {nodeDatum.name}
      </text>
    </g>
  );

  return (
    <div style={{ padding: '20px', fontFamily: 'system-ui, sans-serif' }}>
      <h2>Reto 08: Árbol Binario de Búsqueda</h2>

      <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#f7fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
        {/* Formulario para probar la búsqueda */}
        <form onSubmit={handleSearch} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <strong>Punto 2 (Buscador):</strong>
          <input 
            type="number" 
            value={searchValue} 
            onChange={(e) => setSearchValue(e.target.value)} 
            placeholder="Número"
            style={{ padding: '8px', borderRadius: '4px', border: '1px solid #cbd5e0' }}
          />
          <button type="submit" style={{ padding: '8px 16px', backgroundColor: '#319795', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
            Verificar
          </button>
        </form>
        {searchResult && <p style={{ marginTop: '10px', color: '#2d3748', fontWeight: 'bold' }}>{searchResult}</p>}
        
        <p style={{ marginTop: '10px', fontSize: '14px', color: '#718096' }}>
          <em>* Presiona F12 para abrir la consola y ver los recorridos del Punto 1.</em>
        </p>
      </div>

      {/* PUNTO 3: react-d3-tree */}
      <div style={{ height: '600px', border: '2px dashed #cbd5e0', borderRadius: '8px' }}>
        {treeData && (
          <Tree 
            data={treeData} 
            orientation="vertical"
            pathFunc="straight"
            translate={{ x: 350, y: 50 }}
            renderCustomNodeElement={renderCustomNodeElement}
          />
        )}
      </div>
    </div>
  );
}