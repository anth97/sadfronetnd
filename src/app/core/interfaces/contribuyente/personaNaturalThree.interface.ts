export interface PersonaNaturalThree{
    contribuyente: {
        ubigeo: string,
        cod_tipo_contribuyente: string,
        cod_tipo_via: string,
        domicilio: string,
        nro_domicilio: string,
        referencia_domicilio: string,
        telefono_principal: string,
        telefono_secundario: string,
        correo_electronico: string,
        personanatural: number
    },
    predio: number,
    cod_tipo_uso: string,
    fec_inicio_vigencia: string,
    fec_fin_vigencia: string,
    cod_tipo_propietario: string,    
    porc_propiedad: string,
}