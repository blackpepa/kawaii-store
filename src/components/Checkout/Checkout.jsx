import React, { useState, useContext } from 'react'
import{CartContext} from '../context/CartContext'
import {Link} from 'react-router-dom' 
import { getFirestore } from '../../firebase/config'
import firebase from 'firebase'
import 'firebase/firestore'
import Swal from 'sweetalert2'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col  from 'react-bootstrap/Col'

export const Checkout = () => {

  const{carrito, precioTotal, vaciarCarrito} = useContext(CartContext)

  const [email, setEmail] =useState("")
  const [emailConfirmar, setEmailConfirmar] =useState("")
  const [nombre, setNombre] = useState("")
  const [apellido, setApellido] = useState("")
  const [telefono, setTelefono] = useState ("")


 
  const handlerSubmit =(e) =>{
    e.preventDefault()


  if(email === emailConfirmar){

    const orden = {
    buyer:{
      email,
      emailConfirmar,
      nombre,
      apellido,
      telefono
    },
    item: carrito,
    total_price: precioTotal(),
    data: firebase.firestore.Timestamp.fromDate(new Date())
  }

    const db = getFirestore()
    const ordenes = db.collection('ordenes')
    ordenes.add(orden)
    .then((res) => {
        Swal.fire({
        icon: 'success',
        title: 'Su compra fue realizada con éxitos',
        text: `Guarde su numero de compra: ${res.id}`,
        willClose: () => {
          vaciarCarrito()
        }
      })
    })
    .finally(() => {
      console.log('Operacion realizada con exito')
    })

    carrito.forEach((item) => {
      const docRef = db.collection('productos').doc(item.id)

      docRef.get()
        .then((doc) => {
          docRef.update({
            stock: doc.data().stock - item.counter
          })
        })
    })
  }
  else{
    Swal.fire({
      icon: 'error',
      title: 'Revisá que el email coincida',
    })
  }
}
  return (
    <Container fluid>
      <Row>
        <Col>
        <h3>Resumen de compra</h3>
            <hr />
            {
              carrito.map((prod) => (
                <>
                  <div className='mt-5'>
                    <h5><strong>Producto:</strong> {prod.description}</h5>
                    <h5><strong>Precio:</strong> ${prod.price}</h5>
                    <h5><strong>Cantidad:</strong> {prod.counter}</h5>
                  </div>
                </>
              ))
            }
            <hr />
            <h4><strong>Precio total: ${precioTotal()}</strong></h4>
        </Col>
        <Col>
        <h3>Terminar compra</h3>
          <hr />

      <form onSubmit={handlerSubmit} className='container mt-5 py-3'>

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input type="email" className="form-control" onChange={(e) => setEmail(e.target.value)} value={email} required/>
        </div>
        <div className="form-group">
          <label htmlFor="emailConfirmar">Confirmar Email</label>
          <input type="email" className="form-control" onChange={(e) => setEmailConfirmar(e.target.value)} value={emailConfirmar} required/>
        </div>
        <div className="form-group">
          <label htmlFor="nombre">Nombre</label>
          <input type="text" className="form-control" onChange={(e) => setNombre(e.target.value)} value={nombre} required/>
        </div>
        <div className="form-group">
          <label htmlFor="apellido">Apellido</label>
          <input type="text" className="form-control" onChange={(e) => setApellido(e.target.value)} value={apellido} required/>
        </div>
        <div className="form-group">
          <label htmlFor="telefono">Teléfono</label>
          <input type="text" className="form-control" onChange={(e) => setTelefono(e.target.value)} value={telefono} required/>
        </div>
        <Link to='/cart' className='btn btn-outline-info my-3'>Volver al carrito</Link>
        <button type='submit' className='btn btn-success m-3'>Finalizar compra</button>

      </form>

        </Col>
      </Row>
    </Container>
    
  )
  }