import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import Button from '../common/Button';
import Input from '../common/Input';
import './LoginForm.css';

const LoginForm = () => {
  console.log('🎯 LoginForm component is rendering');
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { login } = useAuth();
  const navigate = useNavigate();
  
  console.log('🎯 LoginForm hooks initialized, login function:', typeof login);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Limpiar error cuando el usuario empiece a escribir
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    console.log('🔍 Iniciando login con datos:', formData);

    try {
      const result = await login(formData);
      console.log('🔍 Resultado del login:', result);
      
      if (result.success) {
        console.log('✅ Login exitoso, redireccionando...');
        // Redireccionar al dashboard después del login exitoso
        navigate('/dashboard');
      } else {
        console.log('❌ Error en login:', result.error);
        setError(result.error || 'Error durante el login');
      }
    } catch (err) {
      console.log('❌ Excepción durante login:', err);
      setError('Error de conexión. Intente nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-form-container">
      <div className="login-form-card">
        <div className="login-header">
          <div className="login-logo">
            <h1>SISAC-ERP</h1>
            <p>Sistema Integral de Administración Contable</p>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <Input
              type="email"
              name="email"
              placeholder="Correo electrónico"
              value={formData.email}
              onChange={handleChange}
              required
              disabled={loading}
              icon="✉️"
            />
          </div>

          <div className="form-group">
            <Input
              type="password"
              name="password"
              placeholder="Contraseña"
              value={formData.password}
              onChange={handleChange}
              required
              disabled={loading}
              icon="🔒"
            />
          </div>

          {error && (
            <div className="error-message">
              <span>⚠️ {error}</span>
            </div>
          )}

          <Button
            type="submit"
            variant="primary"
            disabled={loading || !formData.email || !formData.password}
            fullWidth
          >
            {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </Button>
        </form>

        <div className="login-footer">
          <div className="test-credentials">
            <h4>Credenciales de Prueba:</h4>
            <div className="credential-item">
              <strong>Gestión Tributaria:</strong> tributario@sisac.com / admin123
            </div>
            <div className="credential-item">
              <strong>Pago de Planilla:</strong> planilla@sisac.com / admin123
            </div>
            <div className="credential-item">
              <strong>Contratación:</strong> contratacion@sisac.com / admin123
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;