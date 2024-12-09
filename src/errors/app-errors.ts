class AppError extends Error {
    public readonly statusCode:number
    constructor(
        public readonly message:string,
        statusCode:number
    ){
        super(message)
        this.statusCode = statusCode

        Object.setPrototypeOf(this, AppError.prototype)

        if(Error.captureStackTrace){
            Error.captureStackTrace(this,AppError)
        }
    }
}

export default AppError