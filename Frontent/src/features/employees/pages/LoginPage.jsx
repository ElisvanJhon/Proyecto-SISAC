import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '@styles_e/Login.css';
import Input from '@common/Input.jsx'; // Importa el componente Input
import Button from '@common/Button.jsx'; // Importa el componente Button

const LoginPage = ({ onLogin }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();
        setError('');

        if (username === 'admin' && password === 'admin') {
            onLogin();
            navigate('/dashboard');
        } else {
            setError('Usuario o contraseña incorrectos.');
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <h2>Ingresar al sistema SISAC</h2>
                <form onSubmit={handleLogin}>
                    <Input
                        label="Usuario:"
                        type="text"
                        name="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                    <Input
                        label="Contraseña:"
                        type="password"
                        name="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    {error && <p className="error-message">{error}</p>}
                    <Button type="submit">Ingresar</Button>
                </form>
                <p>
                    ¿No tienes una cuenta? <Link to="/signup">Solicitar acceso</Link>
                </p>
            </div>
        </div>
    );
};

export default LoginPage;