import React, { useState, useEffect } from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import { AiOutlineFileText } from 'react-icons/ai';
import { useLosses } from '../Context/Losses.context';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 600,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    pt: 2,
    px: 4,
    pb: 3,
};

function SeeLosses({ supply }) {
    const { losses, getLosses } = useLosses();
    const [open, setOpen] = useState(false);

    useEffect(() => {
        getLosses();
    }, []);

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const hasLosses = losses.some(loss => {
        console.log('Supplies_ID:', loss.Supplies_ID, 'ID_Supplies:', supply.ID_Supplies);
        return String(loss.Supplies_ID) === String(supply.ID_Supplies);
    });
    return (
        <React.Fragment>
            <button
                type="button"
                className={`ml-1 btn btn-icon btn-info ${(!hasLosses || !supply.State) ? "text-gray-400 cursor-not-allowed" : ""}`}
                onClick={handleOpen}
                disabled={!hasLosses || !supply.State}
                title="Este botón sirve para ver las bajas del insumo"
            >
                <AiOutlineFileText />
            </button>

            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="child-modal-title"
                aria-describedby="child-modal-description"
            >
                <Box sx={style}>
                    <div className="col-md-12">
                        <div className="card">
                            <div className="card-header">
                                <h5>Pérdidas Asociadas</h5>
                            </div>
                            <div className="card-body">
                                <div className="table-responsive">
                                    <table className="table table-hover">
                                        <thead>
                                            <tr>
                                                <th>Cantidad pérdida</th>
                                                <th>Medida</th>
                                                <th>Razón de pérdida</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {losses
                                                .filter(loss => loss.Supplies_ID === supply.ID_Supplies)
                                                .map((loss) => (
                                                    <tr key={loss.ID_Losses}>
                                                        <td>{loss.Unit}</td>
                                                        <td>{loss.Measure}</td>
                                                        <td style={{ maxWidth: '200px', overflowX: 'auto' }} >{loss.Reason}</td>
                                                    </tr>
                                                ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                        <div className="buttonconfirm">
                            <div className="mb-3">
                                <button
                                    className="btn btn-primary"
                                    onClick={handleClose}
                                    type="button"
                                    title="Este botón sirve para cerrar la ventana modal."
                                >
                                    Cerrar
                                </button>
                            </div>
                        </div>
                    </div>
                </Box>
            </Modal>
        </React.Fragment>
    );
}

export default SeeLosses;
