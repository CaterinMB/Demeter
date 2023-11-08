import React from 'react'
import logo from '../img/logo.png'
import {AiOutlineMail, AiOutlineLock} from 'react-icons/ai'
import '../css/style.css'
import '../css/landing.css'
import '../fonts/cryptofont.css'
import '../fonts/feather.css'
import '../fonts/fontawesome.css'
import '../fonts//material.css'

function NewPassword() {
  return (
    <div className="">
         <div class="auth-wrapper">
	<div class="auth-content">
		<div class="card">
			<div class="row align-items-center text-center">
				<div class="col-md-12">
					<div class="card-body">
						<img src={logo} alt="" class="img-fluid mb-4"/>
                        <p>Escribe tu nueva contraseña</p>
						<div class="input-group mb-3">
							<span class="input-group-text"><i data-feather="lock"><AiOutlineLock/></i></span>
							<input type="email" class="form-control" placeholder="Nueva contraseña"/>
						</div>
						<div class="input-group mb-4">
							<span class="input-group-text"><i data-feather="lock"><AiOutlineLock/></i></span>
							<input type="password" class="form-control" placeholder="Confirmar contraseña "/>
						</div>
						<button class="btn btn-block btn-primary mb-4" onclick="location.href='index.html'">Enviar</button>
						
					</div>
				</div>
			</div>
		</div>
	</div>
</div>


    </div>
   
  )
}

export default NewPassword;