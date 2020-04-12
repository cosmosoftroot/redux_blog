import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as usuariosActions from '../../actions/usuariosActions';
import * as publicacionesActions from '../../actions/publicacionesActions';
import Spinner from '../General/Spinner';
import Fatal from '../General/Fatal';
import Comentarios from './Comentarios';

const { traerTodos: usuariosTraerTodos } = usuariosActions;
const {
  traerPorUsuario: publicacionesTraerPorUsuario,
  abrirCerrar,
  traerComentarios,
  limpiarError
} = publicacionesActions;

class Publicaciones extends Component {
  async componentDidMount() {
    const {
      usuariosTraerTodos,
      publicacionesTraerPorUsuario,
      match: {
        params: { key },
      },
      limpiarError
    } = this.props;

    if (!this.props.usuariosReducer.usuarios.length) {
      await usuariosTraerTodos();
    }

    if (this.props.usuariosReducer.error) {
      return;
    }

    limpiarError();

    if (!('publicaciones_key' in this.props.usuariosReducer.usuarios[key])) {
      await publicacionesTraerPorUsuario(key);
    }
  }

  ponerUsuario() {
    const {
      usuariosReducer,
      match: {
        params: { key },
      },
    } = this.props;

    if (usuariosReducer.error) {
      return <Fatal mensaje={usuariosReducer.error} />;
    }

    if (!usuariosReducer.usuarios.length || usuariosReducer.cargando) {
      return <Spinner />;
    }

    const nombre = usuariosReducer.usuarios[key].name;
    return <h1 className="title">{`${nombre}'s posts`}</h1>;
  }

  ponerPublicaciones() {
    const {
      usuariosReducer,
      usuariosReducer: { usuarios },
      publicacionesReducer,
      publicacionesReducer: { publicaciones },
      match: {
        params: { key },
      },
    } = this.props;

    if (!usuarios.length) return;
    if (usuariosReducer.error) return;

    if (publicacionesReducer.cargando) {
      return <Spinner />;
    }

    if (publicacionesReducer.error) {
      return <Fatal mensaje={publicacionesReducer.error} />;
    }

    if (!publicaciones.length) return;
    if (!('publicaciones_key' in usuarios[key])) return;

    const { publicaciones_key } = usuarios[key];
    return this.mostrarInformacion(
      publicaciones[publicaciones_key],
      publicaciones_key
    );
  }

  mostrarInformacion = (publicaciones, pub_key) =>
    publicaciones.map((publicacion, com_key) => (
      <div
        className='post'
        key={publicacion.id}
        onClick={() =>
          this.mostrarComentarios(pub_key, com_key, publicacion.comentarios)
        }
      >
        <h2>{publicacion.title}</h2>
        <p>{publicacion.body}</p>
        {publicacion.abierto ? (
          <Comentarios comentarios={publicacion.comentarios} />
        ) : (
          ''
        )}
      </div>
    ));

  mostrarComentarios = (pub_key, com_key, comentarios) => {
    this.props.abrirCerrar(pub_key, com_key);
    if (!comentarios.length) {
      this.props.traerComentarios(pub_key, com_key);
    }
  };

  render() {
    console.log(this.props);
    return (
      <div>
        {this.ponerUsuario()}
        {this.ponerPublicaciones()}
      </div>
    );
  }
}

const mapStateToProps = ({ usuariosReducer, publicacionesReducer }) => {
  return { usuariosReducer, publicacionesReducer };
};

const mapDispatchToProps = {
  usuariosTraerTodos,
  publicacionesTraerPorUsuario,
  abrirCerrar,
  traerComentarios,
  limpiarError
};

export default connect(mapStateToProps, mapDispatchToProps)(Publicaciones);