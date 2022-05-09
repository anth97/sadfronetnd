export interface PredioConst{
    id?: string,
    cod_estado_construccion: string,
    cod_estado_conservacion: string,
    cod_estructura_predominante: string
    fec_inicio_vigencia: string,
    area_construida: number,
    nombre_bloque: string,
    numero_piso: number,
    antiguedad: number,
    //valor_unitario_m2: number,
    valor_incremento?: number,
    porcent_increment?: number,
    porcent_depreciado?: number,
    valor_depreciado?: number,
    valor_construccion?: number,
    predio: number,
    predioconstruccioncategoria_set?: ConstruccionCategoria[]
}

export interface ConstruccionCategoria{
    //predio_construcc = models.ForeignKey(PredioContruccion, on_delete=models.CASCADE)
    cod_clasificacion_cate_construcc: string,
    cod_cate_construcc: string,
    monto_valor_unitario: number,
    monto_valor: number,
    valor?: string
}