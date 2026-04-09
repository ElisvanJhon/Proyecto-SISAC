import React from 'react';

const TestConvocatorias = () => {
  console.log('🎯 TestConvocatorias component is rendering');
  
  return (
    <div style={{ 
      padding: '40px', 
      backgroundColor: '#e8f5e8', 
      minHeight: '100vh',
      fontFamily: 'Arial, sans-serif'
    }}>
      <h1 style={{ color: '#2e7d32', marginBottom: '20px' }}>
        🎉 ¡Página de Convocatorias Funcionando!
      </h1>
      <div style={{ 
        backgroundColor: 'white', 
        padding: '20px', 
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <p><strong>✅ Ruta funcionando:</strong> /convocatorias</p>
        <p><strong>✅ Componente renderizado:</strong> TestConvocatorias</p>
        <p><strong>✅ React funcionando:</strong> Estado OK</p>
      </div>
    </div>
  );
};

export default TestConvocatorias;