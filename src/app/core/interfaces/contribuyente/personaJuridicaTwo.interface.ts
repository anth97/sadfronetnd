export interface PersonaJuridicaTwo{
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
        personajuridica: {
            representante_legal: number,
            cod_tipo_persona_juridica: string,
            razon_social: string,
            num_ruc: string,
            fec_constitucion: string,
            fec_reg: string,
            fec_mod: string,
            usuario_mod_id: string,
            usuario_reg_id: string
        }
    }
    predio: number,
    cod_tipo_uso: string,
    cod_tipo_propietario: string,
    fec_inicio_vigencia: string,
    fec_fin_vigencia: string,
    porc_propiedad: string
}