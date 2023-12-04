import React, { useEffect, useLayoutEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useShoppingContext } from '../Context/Shopping.context';
import { useSupplier } from "../Context/Supplier.context";
import { MdToggleOn, MdToggleOff } from "react-icons/md";
import ShoppingView from '../Components/ShoppingView';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

import '../css/style.css';
import "../css/landing.css";

pdfMake.vfs = pdfFonts.pdfMake.vfs;


function ShoppingPage() {
  const { getOneShopping, shopping: Shopping, selectAction, disableShopping, getShopingByProvider } = useShoppingContext();
  const [searchTerm, setSearchTerm] = useState("");
  const [shoppingData, setShoppingData] = useState([])
  const [searchDate, setSearchDate] = React.useState(null); // Estado para la fecha seleccionada
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  function DateRangeSelector({ handleDateChange }) {
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
  
    const handleGenerateReport = () => {
      handleDateChange(startDate, endDate);
    };

  }

  const handlePageClick = ({ selected }) => {
    setPageNumber(selected);
  };

  useLayoutEffect(() => {
    setShoppingData([])
    return async () => {
      const data = await getShopingByProvider();
      setShoppingData(data)
    }
  }, []);

  const status = Shopping.State ? "" : "desactivado";

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredShopping = shoppingData.filter((shoppingItem) => {
    const {
      ID_Shopping,
      Datetime,
      Total,
      State,
      Supplier: {
        Name_Supplier
      }
    } = shoppingItem;
    const itemDate = new Date(shoppingItem.Datetime).toLocaleDateString('en-CA');

  // Formatear searchTerm para asegurar consistencia
  const searchDate = new Date(searchTerm).toLocaleDateString('en-CA'); // Asegúrate de usar el formato correcto aquí

  // Comparar las fechas formateadas
  return itemDate === searchDate.toLowerCase() ||
    `${ID_Shopping} ${itemDate} ${Total} ${State} ${Name_Supplier}`.toLowerCase().includes(searchTerm.toLowerCase());
});

const generatePDF = () => {
  if (startDate && endDate) {
    const filteredData = shoppingData.filter((shoppingItem) => {
      const itemDate = new Date(shoppingItem.Datetime).toLocaleDateString('en-CA');
      return itemDate >= startDate && itemDate <= endDate;
    });

    const tableBody = filteredData.map((shopping) => {
      const { ID_Shopping, Datetime, Total, Supplier: { Name_Supplier } } = shopping;
      return [
        { text: ID_Shopping, bold: true, alignment: 'center' },
        { text: Name_Supplier, alignment: 'center' },
        { text: new Date(Datetime).toLocaleDateString(), alignment: 'center' },
        { text: Total, alignment: 'center' },
      ];
    });

    const documentDefinition = {
      content: [
        { text: 'Reporte de compras', fontSize: 16, margin: [0, 0, 0, 10] },
        {
          table: {
            headerRows: 1,
            widths: ['auto', '*', '*', 'auto'],
            body: [
              ['ID', 'Proveedor', 'Fecha', 'Total'],
              ...tableBody,
            ],
          },
          layout: {
            fontSize: 12,
            margin: [0, 5, 0, 15],
            fillColor: (rowIndex, node, columnIndex) => {
              return rowIndex % 2 === 0 ? '#CCCCCC' : null;
            },
          },
        },
      ],
      styles: {
        table: {
          width: '100%',
        },
      },
    };

    pdfMake.createPdf(documentDefinition).download('shopping_report.pdf');
  } else {
    console.log('Por favor, selecciona un rango de fechas válido');
  }
};



   

  return (
    <section className="pc-container">
      <div className="pcoded-content">
        <div className="row w-100">
          <div className="col-md-12">
            <div className=" w-100 col-sm-12">
              <div className="card">
                <div className="card-header">
                  <h5>Visualización de compras</h5>
                </div>
                <div className="card-body">
                  <div className="row">
                    <div className="col-md-6">
                      <Link to="/shop">
                        <button type="button" className="btn btn-primary" onClick={() => { selectAction(1) }}>
                          Registrar compra
                        </button>
                      </Link>
                     
                         <button title='Presiona para generar el pdf ' className="btn btn-outline-secondary p-2 ml-1" onClick={generatePDF}>Generar Reporte </button>

                          
                      
                    </div>
                    <div className="col-md-6">
                      <div className="form-group">
                        <input
                          type="search"
                          title='Presiona para buscar la compra'
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
                            <th>Id</th>
                            <th>Fecha</th>
                            <th>Proveedor</th>
                            <th>Total</th>
                            <th>Estado</th>
                            <th>Acciones</th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredShopping.map((
                            {
                              ID_Shopping,
                              Datetime,
                              Total,
                              State,
                              Supplier: {
                                Name_Supplier,
                                ID_Supplier
                              }
                            }
                          ) => (
                            <tr key={ID_Shopping}>
                              <td>{ID_Shopping}</td>
                              <td>{new Date(Datetime).toLocaleDateString()}</td>
                              <td>{Name_Supplier}</td>
                              <td>{Total}</td>
                              <td className={`${status}`}>
                                {State ? "Habilitado" : "Deshabilitado"}
                              </td>

                              <td className="flex items-center" title='Presiona para ver el detalle de la compra'>
                                <ShoppingView id={ID_Supplier} date={Datetime} />

                                <button
                                  type="button"
                                  title='Presiona para inhabilitar o habilitar la compra'
                                  className={`btn  btn-icon btn-success ${status}`}
                                  onClick={() => disableShopping(ID_Shopping)}

                                >
                                  {State ? (
                                    <MdToggleOn className={`estado-icon active${status}`} />
                                  ) : (
                                    <MdToggleOff className={`estado-icon inactive${status}`} />

                                  )}
                                </button>
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

export default ShoppingPage