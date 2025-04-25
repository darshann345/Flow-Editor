# React Product Flow Application

A React application that displays products from an external API in a sidebar and visualizes them in a flowchart. The application features a dark/light mode toggle for enhanced user experience.

## Features

- **Product List Display**: Fetches and displays products from the DummyJSON API
- **Interactive Flowchart**: Visualizes product data in a flowchart format
- **Dark/Light Mode**: Toggle between dark and light themes
- **Responsive Layout**: Split-view interface with sidebar and main content area
- **Styled Components**: Modern styling approach using styled-components
- **Public Assets**: Includes static assets for enhanced UI presentation

## How the Project Works

### Overview

This application integrates a product catalog with a flowchart visualization system, all wrapped in a theme-switchable interface.

1. **Data Flow**:
   - The application fetches product data from the DummyJSON API on initial load
   - Product data is stored in React state and passed to the ProductList component
   - The FlowChart component visualizes relationships between products

2. **Component Interaction**:
   - `App.js`: The main container that manages state and layout
   - `ProductList`: Renders the sidebar with product information
   - `FlowChart`: Creates the interactive flowchart visualization

3. **Theme Switching**:
   - Dark/light mode is toggled via a button in the FlowChart component
   - The theme state is managed in App.js and passed down to child components
   - Styled-components use this state to conditionally apply styling

4. **Public Assets**:
   - Static assets in the public folder are used throughout the application
   - These may include product images, icons for the UI, and flowchart elements
   - Assets are referenced using the public URL path

### Detailed Workflow

When the application loads:
1. The `useEffect` hook triggers the `fetchProducts` function
2. Product data is retrieved from the API and stored in state
3. The sidebar renders the ProductList with the fetched products
4. The FlowChart component initializes with the current theme setting
5. Users can interact with both the product list and flowchart
6. The theme can be toggled at any time, affecting the entire application's appearance

## Getting Started

### Prerequisites

- Node.js (v14.0.0 or later recommended)
- npm or yarn package manager

### Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/yourusername/react-product-flow.git
```

```bash
cd react-product-flow
```

```bash
npm install
```

### Running the Application

Start the development server:

```bash
npm start
```

The application will be available at [http://localhost:3000](http://localhost:3000).

## Implementation Details

### Data Fetching

The application fetches product data from the [DummyJSON API](https://dummyjson.com/products) and displays it in the sidebar.

### Dark Mode Implementation

Dark mode is implemented using styled-components with props to conditionally apply styles:

```jsx
const AppContainer = styled.div`
  display: flex;
  height: 100vh;
  background-color: ${props => props.darkMode ? '#222' : '#f0f0f0'};
  transition: background-color 0.3s ease;
`;
```

### Using Public Assets

The application leverages assets from the public folder:

```jsx
// Example of referencing a public asset
<img src={`${process.env.PUBLIC_URL}/assets/product-icon.png`} alt="Product" />
```

## Customization

You can customize the theme colors by modifying the styled-components in App.js:

```jsx
// For dark mode
background-color: ${props => props.darkMode ? '#YOUR_DARK_COLOR' : '#YOUR_LIGHT_COLOR'};
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Author

Developed by Darshan N

If you need any additional details or have questions about this project, please feel free to contact me.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [DummyJSON](https://dummyjson.com/) for providing the product API
- [Create React App](https://github.com/facebook/create-react-app) for the project setup
- [styled-components](https://styled-components.com/) for the styling solution
"# Flow-Editor" 
