export interface PredioAreaComun {
    
    codigo: string,
    descripcion: string,
    valor_bien_comun: number,
    cod_tipo_bien_comun: string,
    porcent_condicion: number,
    valor_porcentaje?: number,
    fec_inicio_vigencia: string,
    antiguedad?: number,
    predio: string,
    usuario_reg: string,
    usuario_mod: string
    
}

export interface PredioAreaComunCompartido {    
    predio: number,
    predio_bien_comun: number,
    usuario_reg?: number,
    usuario_mod?: number,
    porcent_terreno?: number,
    porcent_construcc: number,
    porcent_obra_comple: number,
    monto_valor_porcent_terreno: number,
    monto_valor_porcent_const: number,
    monto_valor_porcent_obra_compl: number
    
}