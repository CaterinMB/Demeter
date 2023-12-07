import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import Box from "@mui/material/Box";
import { useForm } from 'react-hook-form';
import { useUser } from '../Context/User.context.jsx';

const style = {
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    pt: 2,
    px: 4,
    pb: 3
};

function UpdateUser({ onClose, userToEdit }) {
    const { register, handleSubmit, formState: { errors } } = useForm({ defaultValues: userToEdit });
    const { updateUser, user } = useUser();
    const [selectedType, setSelectedType] = useState(userToEdit.Type_Document);
    const { role } = useRole();
    const [selectedRole, setSelectedRole] = useState(userToEdit.Role_ID);

    const typeOptions = [
        { label: 'Cédula de ciudadanía', value: 'CC' },
        { label: 'Cédula de extranjería', value: 'CE' },
        { label: 'Pasaporte', value: 'PB' },
    ];

    const rolOpcions = role.map(option => ({ label: option.Name_Role, value: option.ID_Role }));

    const customStyles = {
        control: (provided, state) => ({
            ...provided,
            border: state.isFocused ? '1px solid #201E1E' : '1px solid #201E1E',
            '&:hover': {
                border: '1px solid #201E1E',
            },
        }),
        option: (provided, state) => ({
            ...provided,
            backgroundColor: state.isSelected ? '#e36209' : state.isFocused ? '#e36209' : 'white',
            color: state.isSelected ? 'white' : state.isFocused ? '#555' : '#201E1E',
            '&:hover': {
                backgroundColor: '#e36209',
                color: 'white',
            },
            cursor: state.isDisabled ? 'not-allowed' : 'default',
        }),
    };

    useEffect(() => {
        register('Document', {
            required: 'El documento es obligatorio',
            validate: (value) => {
                const duplicateUser = user.find(
                    (users) =>
                        users.Document === value &&
                        users.ID_User !== userToEdit.ID_User
                );

                if (duplicateUser) {
                    return 'Este número de documento ya existe.';
                }
                return true;
            },
        });
        register('Email', {
            required: 'El correo es obligatorio',
            validate: (value) => {
                const duplicateEmail = user.find(
                    (users) =>
                        users.Email === value &&
                        users.ID_User !== userToEdit.ID_User
                );

                if (duplicateEmail) {
                    return 'Este correo ya existe.';
                }
                return true;
            },
        });
    }, [register, user, userToEdit.ID_User]);

    const onSubmit = handleSubmit(async (values) => {
        values.Type_Document = selectedType;
        values.Role_ID = selectedRole;

        updateUser(userToEdit.ID_User, values);
        onClose();
    });

    const onCancel = () => {
        onClose();
    };

    return (
        <Box sx={{ ...style, width: 600 }}>
            <div>
                <div className="col-md-12">
                    <div className="card">
                        <div className="card-header">
                            <h5>Editar un empleado</h5>
                        </div>
                        <div className="card-body">
                            <form onSubmit={onSubmit}>
                                <div className="control">
                                    <div className="form-group col-md-6 ml-3">
                                        <label htmlFor="Type_Document" className="form-label mt-3">
                                            Tipo de documento: <strong>*</strong>
                                        </label>
                                        <Select
                                            options={typeOptions}
                                            {...register("Type_Document")}
                                            value={selectedType}
                                            onChange={(selectedOption) => setSelectedType(selectedOption)}
                                            className='form-selects'
                                            styles={customStyles}
                                            title='Se selecciona el tipo de documento del mesero.'
                                            theme={(theme) => ({
                                                ...theme,
                                                colors: {
                                                    ...theme.colors,
                                                    primary: '#201E1E',
                                                },
                                            })}
                                        />
                                        {errors.Type_Document && (
                                            <p className="text-red-500">
                                                {errors.Type_Document.message}
                                            </p>
                                        )}
                                    </div>

                                    <div className="form-group col-md-6 ml-3">
                                        <label htmlFor="Document" className="form-label">
                                            Número de identidad: <strong>*</strong>
                                        </label>
                                        <input
                                            type="number"
                                            {...register("Document", {
                                                required: "El documento es obligatorio",
                                                validate: (value) => {
                                                    const parsedValue = parseInt(value);
                                                    if (
                                                        isNaN(parsedValue) ||
                                                        parsedValue < 10000000 ||
                                                        parsedValue > 9999999999
                                                    ) {
                                                        return "El número no es valido, debe tener de 8 a 10 caracteres.";
                                                    }
                                                }
                                            })}
                                            className="form-control"
                                            title='Se ingresa el numero de identificacion del mesero.'
                                        />
                                        {errors.Document && (
                                            <p className="text-red-500">
                                                {errors.Document.message}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <div className="control">
                                    <div className="form-group col-md-6 ml-3">
                                        <label htmlFor="Name_User" className="form-label">
                                            Nombres: <strong>*</strong>
                                        </label>
                                        <input
                                            {...register("Name_User", {
                                                required: "El nombre es obligatorio",
                                                pattern: {
                                                    value: /^[A-ZÁÉÍÓÚÑ][a-záéíóúñ\s]*[a-záéíóúñ]$/,
                                                    message:
                                                        "El nombre del mesero debe tener la primera letra en mayúscula y solo letras."
                                                }
                                            })}
                                            type="text"
                                            className="form-control"
                                            title='Se ingresa el nombre del mesero.'
                                        />
                                        {errors.Name_User && (
                                            <p className="text-red-500">
                                                {errors.Name_User.message}
                                            </p>
                                        )}
                                    </div>

                                    <div className="form-group col-md-6 ml-3">
                                        <label htmlFor="LastName_User" className="form-label">
                                            Apellidos: <strong>*</strong>
                                        </label>
                                        <input
                                            {...register("LastName_User", {
                                                required: 'El apellido es obligatorio',
                                                pattern: {
                                                    value: /^[A-ZÁÉÍÓÚÑ][a-záéíóúñ\s]*[a-záéíóúñ]$/,
                                                    message:
                                                        "El apellido del mesero debe tener la primera letra en mayúscula y solo letras."
                                                }
                                            })}
                                            type="text"
                                            className="form-control"
                                            title='Se ingresa el apellido del mesero.'
                                        />
                                        {errors.LastName_User && (
                                            <p className="text-red-500">
                                                {errors.LastName_User.message}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <div className="control">
                                    <div className="form-group col-md-6 ml-3">
                                        <label htmlFor="Restaurant" className="form-label">
                                            Restaurante: <strong>*</strong>
                                        </label>
                                        <input
                                            {...register("Restaurant", {
                                                required: "El restaurante es obligatorio",
                                                pattern: {
                                                    value: /^[A-ZÁÉÍÓÚÑ][a-záéíóúñ\s]*[a-záéíóúñ]$/,
                                                    message:
                                                        "El apellido del mesero debe tener la primera letra en mayúscula y solo letras."
                                                }
                                            })}
                                            type="text"
                                            className="form-control"
                                            title='Se ingresa el restaurante al que pertenece el mesero.'
                                        />
                                        {errors.Restaurant && (
                                            <p className="text-red-500">
                                                {errors.Restaurant.message}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <div className="buttonconfirm">
                                    <div className="ml-3">

                                        <button
                                            className="btn btn-primary"
                                            onClick={onCancel}
                                            type="button"
                                            title='Se cancelan los datos del nuevo mesero.'
                                        >
                                            Cancelar
                                        </button>
                                        <button
                                            className="btn btn-primary mr-5"
                                            type="submit"
                                            title='Se guardan los datos del nuevo mesero.'
                                        >
                                            Guardar
                                        </button>

                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </Box>
    )
}

export default UpdateUser