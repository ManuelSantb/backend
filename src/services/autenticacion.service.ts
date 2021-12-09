import { /* inject, */ BindingScope, injectable} from '@loopback/core';
import { repository } from '@loopback/repository';
import { Persona } from '../models';
import { PersonaRepository } from '../repositories';
import { Llaves } from '../config/llaves';
const generador = require("password-generator")
const cryptoJS = require("crypto-js")
const jwt = require("jsonwebtoken");

@injectable({scope: BindingScope.TRANSIENT})
export class AutenticacionService {
  constructor(
    @repository(PersonaRepository)
      public personaRepository:PersonaRepository
      )
   { }

  /*
   * Add service methods here
   */
  GenerarClave() {
    let clave = generador(8, false);
    return clave;
  }

  cifrarClave(clave: string) {
    let claveCifrada = cryptoJS.MD5(clave).tostring();
    return claveCifrada;
  }
  IdentificarPersona (usuario:string, clave:string){
    try{
      let p= this.personaRepository.findOne({where:{correo:usuario,clave:clave}});
      if (p){    
        return p    
      }
      return false;
    }
    catch {
      return false;
  }
  }
  GenerarTokenJWT(persona:Persona){
    let token=jwt.sign({
      data:{
        id:persona.id,
        correo:persona.correo,
        nombre:persona.nombre +" "+persona.apellido
      }
    },
    Llaves.clavejwt);
    return token;
  }
  validarTokenJWT(token:string){
    try{
      let datos=jwt.verify(token,Llaves.clavejwt);
      return datos
    }catch{
      return false;
    }
  }

}
