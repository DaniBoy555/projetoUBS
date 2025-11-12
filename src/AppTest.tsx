import { BrowserRouter, Routes, Route } from 'react-router-dom';

function AppTest() {
  return (
    <BrowserRouter>
      <div style={{ padding: '20px', fontFamily: 'Arial' }}>
        <h1>Sistema Multi-OBS - Teste de Roteamento</h1>
        <Routes>
          <Route path="/" element={
            <div>
              <h2>Página Inicial</h2>
              <p>Sistema funcionando! ✅</p>
            </div>
          } />
          <Route path="/test" element={
            <div>
              <h2>Página de Teste</h2>
              <p>Roteamento funcionando! ✅</p>
            </div>
          } />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default AppTest;