import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '@styles_e/DashboardPage.css';
import '@styles_e/EditProfile.css';
import Input from '@common/Input.jsx'; // Importa el componente Input
import Button from '@common/Button.jsx'; // Importa el componente Button

const EditProfilePage = ({ user, setUser }) => {
    // Cargar el estado inicial del usuario desde las props o localStorage
    const [profileData, setProfileData] = useState(() => {
        const storedProfile = localStorage.getItem('userProfile');
        return storedProfile ? JSON.parse(storedProfile) : (user || {});
    });
    
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    // Actualizar el localStorage cada vez que profileData cambie
    useEffect(() => {
        // Aseguramos que solo se guarde cuando haya datos de usuario
        if (profileData && Object.keys(profileData).length > 0) {
            localStorage.setItem('userProfile', JSON.stringify(profileData));
        }
    }, [profileData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfileData({ ...profileData, [name]: value });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) { // 2MB
                alert('La foto es demasiado grande. Por favor, elige una más pequeña.');
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfileData({ ...profileData, profilePic: reader.result });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = (e) => {
        e.preventDefault();
        setUser(profileData);
        alert('Perfil actualizado con éxito.');
        navigate('/dashboard');
    };
    
    const handleGoBack = () => {
        navigate(-1); // Regresa a la página anterior
    };

    return (
        <div className="edit-profile-container">
            <Button onClick={handleGoBack} className="go-back-button">← Volver</Button>
            <h1>Editar Perfil</h1>
            <form onSubmit={handleSave}>
                <div className="profile-photo-section">
                    <label htmlFor="profile-upload" className="profile-photo-label">
                        <img
                            src={profileData.profilePic || "/src/assets/images/default-avatar.png"}
                            alt="Foto de Perfil"
                            className="profile-photo"
                        />
                        <span className="edit-icon">✏️</span>
                    </label>
                    <input
                        id="profile-upload"
                        type="file"
                        accept="image/png, image/jpeg"
                        onChange={handleFileChange}
                        style={{ display: 'none' }}
                    />
                </div>

                <div className="input-row">
                    <Input
                        label="Nombre:"
                        name="firstName"
                        value={profileData.firstName || ''}
                        onChange={handleChange}
                        required
                    />
                    <Input
                        label="Apellido:"
                        name="lastName"
                        value={profileData.lastName || ''}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="input-row">
                    <Input
                        label="Teléfono:"
                        type="tel"
                        name="phone"
                        value={profileData.phone || ''}
                        onChange={handleChange}
                    />
                    <Input
                        label="Correo:"
                        type="email"
                        name="email"
                        value={profileData.email || ''}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="input-row">
                    <Input
                        label="Puesto de trabajo:"
                        name="jobTitle"
                        value={profileData.jobTitle || ''}
                        onChange={handleChange}
                    />
                    <div className="input-group">
                        <label>Contraseña:</label>
                        <input
                            type={showPassword ? 'text' : 'password'}
                            name="password"
                            value="********" // No se puede modificar
                            disabled
                        />
                        <Button type="button" onClick={() => setShowPassword(!showPassword)}>
                            {showPassword ? 'Ocultar' : 'Mostrar'}
                        </Button>
                    </div>
                </div>
                <Button type="submit" className="save-button">Guardar cambios</Button>
            </form>
        </div>
    );
};

export default EditProfilePage;