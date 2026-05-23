import Header from './components/layout/header';
import Footer from './components/layout/footer';
import ChatWidget from './components/chat/chatWidget';
import { Outlet } from 'react-router-dom';
import './App.css';

function App() {
  return (
    <>
      <Header />
      <main className="main-content">
        <Outlet />
      </main>
      <Footer />
      <ChatWidget />
    </>
  );
}

export default App;
