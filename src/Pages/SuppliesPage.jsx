import React, { useState, useEffect } from "react";
import { BiEdit } from "react-icons/bi";
import { AiFillDelete } from "react-icons/ai";
import { MdToggleOn, MdToggleOff } from "react-icons/md";
import { useSupplies } from "../Context/Supplies.context.jsx"
import { useCategorySupplies } from '../Context/CategorySupplies.context.jsx'
import "../css/style.css";
import "../css/landing.css";
import "../fonts/cryptofont.css";
import "../fonts/feather.css";
import "../fonts/fontawesome.css";
import "../fonts//material.css";
import CreateSupplies from "../Components/CreateSupplies.jsx";
import DeleteSupplies from "../Components/DeleteSupplies.jsx";

function SuppliesPage() {
  const { supplies, getSupplies, updateSupplies, toggleSupplyStatus } = useSupplies();
  const { Category_supplies } = useCategorySupplies();
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    getSupplies();
  }, []);


  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredSupplies = supplies.filter((supply) => {
    const {
      Name_Supplies,
    } = supply;
    const searchString =
      `${Name_Supplies}`.toLowerCase();
    return searchString.includes(searchTerm.toLowerCase());
  });


  const onUpdate = (event, id, modalView) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData);

    updateSupplies(id, data);
    modalView(false);
  };

  return (
    <section className="pc-container">
      <div className="pcoded-content">
        <div className="row w-100">
          <div className="col-md-12">
            <div className=" w-100 col-sm-12">
              <div className="card">
                <div className="card-header">
                  <h5>Visualización de insumos</h5>
                </div>
                <div className="card-body">
                  <div className="row">
                    <div className="col-md-6">
                      <CreateSupplies />
                    </div>
                    <div className="col-md-6">
                      <div className="form-group">
                        <input
                          type="search"
                          className="form-control"
                          id="exampleInputEmail1"
                          aria-describedby="emailHelp"
                          placeholder="Buscador"
                          value={searchTerm}
                          onChange={handleSearchChange}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="card-body table-border-style">
                    <div className="table-responsive">
                      <table className="table table-hover">
                        <thead>
                          <tr>
                            <th>Nombre</th>
                            <th>Cantidad</th>
                            <th>Medida</th>
                            <th>Existencias</th>
                            <th>Categoria</th>
                            <th>Estado</th>
                            <th>Acciones</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredSupplies.map((supply) => (
                            <tr key={supply.ID_Supplies}>
                              <td>{supply.Name_Supplies}</td>
                              <td>{supply.Unit}</td>
                              <td>{supply.Measure}</td>
                              <td>{supply.Stock}</td>
                              <td>
                                {supply.SuppliesCategory_ID
                                  ? Category_supplies.find(
                                    (category) =>
                                      category.ID_SuppliesCategory ===
                                      supply.SuppliesCategory_ID
                                  )?.Name_SuppliesCategory || ''
                                  : ''}
                              </td>
                              <td>{supply.State ? 'Habilitado' : 'Deshabilitado'}</td>
                              <td>
                                <div style={{ display: "flex", alignItems: "center" }}>
                                  <button
                                    onClick={() => handleEdit(supply)}
                                    className={`btn btn-icon btn-primary ${!supply.State ? "text-gray-400 cursor-not-allowed" : ""}`}
                                    disabled={!supply.State}
                                  >
                                    <BiEdit />
                                  </button>
                                  <button
                                    onClick={() => handleDelete(supply)}
                                    className={`btn btn-icon btn-danger ${!supply.State ? "text-gray-400 cursor-not-allowed" : ""}`}
                                    disabled={!supply.State}
                                  >
                                    <AiFillDelete />
                                  </button>
                                  <button
                                    type="button"
                                    className={`btn btn-icon btn-success ${barraClass}`}
                                    onClick={() => toggleSupplyStatus(supply.ID_Supplies)}
                                  >
                                    {supply.State ? (
                                      <MdToggleOn className={`estado-icon active ${barraClass}`} />
                                    ) : (
                                      <MdToggleOff className={`estado-icon inactive ${barraClass}`} />
                                    )}
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default SuppliesPage;