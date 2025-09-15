
declare interface INotification {
    severity: "success" | "info" | "warning" | "error",
    timestamp: number // timestamp as milisecond
    message: string
}