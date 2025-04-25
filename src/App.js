import React, { useState, useEffect } from "react";
import "./App.css";
import ProductList from "./Components/ProductList";
import FlowChart from "./Components/FlowChart";
import styled from 'styled-components';

const AppContainer = styled.div`
  display: flex;
  height: 100vh;
  background-color: ${props => props.darkMode ? '#222' : '#f0f0f0'};
  transition: background-color 0.3s ease;
`;

const Sidebar = styled.div`
  width: 300px;
  padding: 20px;
  border-right: 1px solid ${props => props.darkMode ? '#444' : '#ddd'};
  overflow-y: auto;
`;

const FlowChartArea = styled.div`
  flex: 1;
  position: relative;
`;

const App = () => {
  const [product, setProduct] = useState([]);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch('https://dummyjson.com/products');
      const data = await res.json();
      setProduct(data.products);
    } catch (err) {
      console.error(err);
    }
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <AppContainer darkMode={darkMode}>
      <Sidebar darkMode={darkMode}>
        <ProductList product={product} darkMode={darkMode} />
      </Sidebar>
      <FlowChartArea>
        <FlowChart darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      </FlowChartArea>
    </AppContainer>
  );
};

export default App;
