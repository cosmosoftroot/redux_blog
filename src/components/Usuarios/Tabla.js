import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import viewIcon from '../../assets/images/view.png';

const Tabla = (props) => {
  const ponerFilas = () =>
    props.usuarios.map((usuario,key) => (
      <tr key={usuario.id}>
        <td>{usuario.name}</td>
        <td>{usuario.email}</td>
        <td>{usuario.website}</td>
        <td>
          <Link to={`publicaciones/${key}`}>
            {/* <div className='eye-solid icon'></div> */}
            <img src={viewIcon} alt="View" className='icon'/>
          </Link>
        </td>
      </tr>
    ));

  return (
    <div>
      <table className='tabla'>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Website</th>
            <th></th>
          </tr>
        </thead>
        <tbody>{ponerFilas()}</tbody>
      </table>
    </div>
  );
};

const mapStateToProps = (reducers) => {
  return reducers.usuariosReducer;
};

export default connect(mapStateToProps)(Tabla);
