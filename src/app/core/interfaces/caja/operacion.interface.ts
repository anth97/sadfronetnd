export interface Operacion{
    caja_asignada : string,
    contribuyente : string, //cambiar - null
    cod_forma_pago : string,
    cod_tipo_movimiento_caja : string,
    num_operacion : number,
    num_serie : string, //null
    num_recibo : string, //null
    fec_recibo : string, //null
    monto_operacion : number,
    monto_operacion_con_redondeo : number,
    es_extorno : boolean,
    num_operacion_electronica : string, //null
    fec_operacion_electronica : string, //null
    num_cheque : string, //null
    fec_emision_cheque : string, //null
    cod_banco : string, //null
    ejecutante : string, //null
    ejecutante_doc_identidad : string, //null
    user_reg : string, 
    fec_reg : string, 
    user_mod : string, 
    fec_mod : string, 
}