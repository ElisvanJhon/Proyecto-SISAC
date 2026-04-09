import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '@styles_e/Login.css';
import Input from '@common/Input.jsx'; // Importa el componente Input
import Button from '@common/Button.jsx'; // Importa el componente Button

const SignupPage = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        lastname: '',
        companyCode: '',
        phone: '',
        email: '',
        jobTitle: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSignup = (e) => {
        e.preventDefault();
        // ** COMENTARIO: Aquí iría la lógica para enviar los datos al backend **
        console.log('Datos a enviar:', formData);
        
        alert('Solicitud de acceso enviada. Serás redirigido a la página de login.');
        navigate('/login');
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <h2>Solicitar acceso a SISAC</h2>
                <form onSubmit={handleSignup}>
                    <Input
                        label="Nombre:"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                    <Input
                        label="Apellido:"
                        name="lastname"
                        value={formData.lastname}
                        onChange={handleChange}
                        required
                    />
                    <Input
                        label="Código de empresa:"
                        name="companyCode"
                        value={formData.companyCode}
                        onChange={handleChange}
                        required
                    />
                    <Input
                        label="Teléfono:"
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                    />
                    <Input
                        label="Correo:"
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                    <Input
                        label="Puesto de trabajo:"
                        name="jobTitle"
                        value={formData.jobTitle}
                        onChange={handleChange}
                        required
                    />
                    <Button type="submit">Solicitar</Button>
                </form>
                <p>
                    ¿Ya tienes una cuenta? <Link to="/login">Volver a login</Link>
                </p>
            </div>
        </div>
    );
};

export default SignupPage;