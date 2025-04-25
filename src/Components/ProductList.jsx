import React from 'react';
import styled from 'styled-components';
import Avatar from '@mui/material/Avatar';


const ProductContainer = styled.div`
  padding: 10px;
  margin: 10px 0;
  border: 1px solid #ddd;
  border-radius: 5px;
  background-color: ${props => props.darkMode ? '#444' : '#fff'};
  color: ${props => props.darkMode ? '#fff' : '#333'};
  cursor: grab;
  
  &:hover {
    background-color: ${props => props.darkMode ? '#555' : '#f5f5f5'};
  }
`;

const ProductList = ({ product, darkMode }) => {
  const onDragStart = (event, product) => {
    event.dataTransfer.setData('application/json', JSON.stringify(product));
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div style={{ overflowY: 'auto', maxHeight: '100%' }}>
      <h2 style={{ color: darkMode ? '#fff' : '#333' }}>Products</h2>
      {product && product.length > 0 ? (
        product.map((item) => (
          <ProductContainer 
            key={item.id} 
            draggable 
            onDragStart={(e) => onDragStart(e, item)}
            darkMode={darkMode}
          >
            <Avatar alt={item.title} src={item.images} />
            <h3>{item.title}</h3>
            <p>${item.price}</p>
            
          </ProductContainer>
        ))
      ) : (
        <p>Loading products...</p>
      )}
    </div>
  );
};

export default ProductList;
