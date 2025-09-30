# Vue Static App

A simple, lightweight Vue.js static application showcasing basic Vue concepts including components, data binding, event handling, and state management.

## Features

- **Hello World Component**: Demonstrates component props and templating
- **Interactive Counter**: Shows reactive data and event handling
- **Todo List**: Complete CRUD operations with local state management
- **Responsive Design**: Mobile-friendly layout with modern CSS
- **No Build Process**: Uses Vue via CDN for simplicity

## Project Structure

```
vue-static-app/
├── index.html          # Main HTML file
├── app.js             # Vue application logic
├── style.css          # Styling and responsive design
├── package.json       # Project configuration
└── README.md          # This file
```

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm (comes with Node.js)

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd vue
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Running the Application

#### Option 1: Local Development Server
```bash
npm run dev
```
This will start a local server at `http://localhost:3000`

#### Option 2: Alternative Serve Command
```bash
npm run serve
```
This will start a server on a random available port

#### Option 3: Direct File Access
Simply open `index.html` in your browser (though some features may not work due to CORS restrictions)

## Usage

The application includes three main sections:

1. **Hello World Component**: Displays a welcome message using Vue component architecture
2. **Counter**: Interactive buttons to increment, decrement, and reset a counter value
3. **Todo List**: Add, complete, and remove todo items

### Key Vue Concepts Demonstrated

- **Data Binding**: Two-way binding with `v-model`
- **Event Handling**: Click events with `@click`
- **Conditional Rendering**: Dynamic classes with `:class`
- **List Rendering**: `v-for` directive for displaying arrays
- **Components**: Custom component with props
- **Computed Properties**: Derived state calculations
- **Lifecycle Hooks**: Component mounting

## Technologies Used

- **Vue.js 3**: Progressive JavaScript framework
- **Vanilla CSS**: Custom styling with modern features
- **HTML5**: Semantic markup
- **ES6+**: Modern JavaScript features

## Browser Support

This application works in all modern browsers that support ES6+ features:
- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Contributing

Feel free to submit issues and pull requests to improve this static app example.

## License

This project is licensed under the MIT License.