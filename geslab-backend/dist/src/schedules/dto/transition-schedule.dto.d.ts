export declare enum MallaAccion {
    Submit = "submit",
    Adjust = "adjust",
    Resubmit = "resubmit",
    Reject = "reject",
    Publish = "publish"
}
export declare class TransitionScheduleDto {
    accion: MallaAccion;
}
