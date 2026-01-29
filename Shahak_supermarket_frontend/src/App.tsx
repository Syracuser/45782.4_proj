import Layout from './components/Layout';
import AppRoutes from './components/AppRoutes';
import './App.css';
import { ToastContainer } from 'react-toastify';

function App() {
  return (
    <>
      <Layout>
        <AppRoutes />
      </Layout>
      <ToastContainer />
      </>
  );
}

export default App;
