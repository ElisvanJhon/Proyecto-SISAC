import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <div className="not-found-container">
      <div className="not-found-content">
        <div className="not-found-icon">
          <span>404</span>
        </div>
        <h1>Página no encontrada</h1>
        <p>Lo sentimos, la página que buscas no existe o ha sido movida.</p>
        <div className="not-found-actions">
          <Link to="/dashboard" className="btn btn-primary">
            Ir al Dashboard
          </Link>
          <button onClick={() => window.history.back()} className="btn btn-secondary">
            Volver atrás
          </button>
        </div>
      </div>
      
      <style jsx>{`
        .not-found-container {
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 100vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          padding: 20px;
        }
        
        .not-found-content {
          text-align: center;
          background: white;
          padding: 60px 40px;
          border-radius: 20px;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
          max-width: 500px;
          width: 100%;
        }
        
        .not-found-icon {
          font-size: 6rem;
          font-weight: 700;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-bottom: 30px;
        }
        
        .not-found-content h1 {
          font-size: 2rem;
          color: #1f2937;
          margin-bottom: 16px;
        }
        
        .not-found-content p {
          color: #6b7280;
          font-size: 1.1rem;
          margin-bottom: 40px;
          line-height: 1.6;
        }
        
        .not-found-actions {
          display: flex;
          gap: 16px;
          justify-content: center;
          flex-wrap: wrap;
        }
        
        .btn {
          padding: 12px 24px;
          border-radius: 8px;
          font-weight: 500;
          text-decoration: none;
          border: none;
          cursor: pointer;
          transition: all 0.2s ease;
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }
        
        .btn-primary {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
        }
        
        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
        }
        
        .btn-secondary {
          background: #6b7280;
          color: white;
        }
        
        .btn-secondary:hover {
          background: #4b5563;
          transform: translateY(-2px);
        }
        
        @media (max-width: 480px) {
          .not-found-content {
            padding: 40px 20px;
          }
          
          .not-found-icon {
            font-size: 4rem;
          }
          
          .not-found-content h1 {
            font-size: 1.5rem;
          }
          
          .not-found-actions {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
};

export default NotFoundPage;