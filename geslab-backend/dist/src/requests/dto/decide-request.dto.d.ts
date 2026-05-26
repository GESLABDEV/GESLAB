export declare enum DecisionEstado {
    Aprobada = "Aprobada",
    Rechazada = "Rechazada"
}
export declare class DecideRequestDto {
    estado: DecisionEstado;
    comentario: string;
}
