export interface CajaAsignada {
    caja: any,
    user_apertura: any,
    user_cierre: any,
    user_cajero: any,
    monto_actual: number,
    monto_apertura: number,
    monto_cierre: number,
    monto_tarjeta_cierre: number,
    monto_cheque_cierre: number,
    monto_total_cierre: number,
    num_pago_efectivo: number,
    num_pago_tarjeta: number,
    num_pago_cheque: number,
    num_extornos: number,
    fec_cierre: string,
    fec_cierre_real: string,
    movimientoboveda_set:{
        boveda: number,
        cod_tipo_movimiento_boveda: string,
        monto: string,
        detallemovimientoboveda_set: Object[]
    },
    operacion_set:{
        cod_forma_pago: string,
        cod_tipo_movimiento_caja: string,
        monto_operacion: string,
        monto_operacion_con_redondeo: number,
        es_extorno: boolean
    }
}