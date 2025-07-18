import { Response } from "express"

const success = (res: Response,msg: string = "",data: any = {}, statusCode:number=200) => {
    return res.status(statusCode).json({
        success: true,
        statusCode: statusCode,
        msg: msg,
        data: data
    })
}

const badRequest = (res: Response,msg: string = "",data: any = {}, statusCode:number=404) => {
    return res.status(statusCode).json({
        success: false,
        statusCode: statusCode,
        msg: msg,
        data: data,
    })
}

const serverError = (res: Response,msg: string = "",data: any = {}, statusCode:number=500) => {
    return res.status(statusCode).json({
        success: false,
        statusCode: statusCode,
        msg: msg,
        data: data
    })
}

export const response = {
    success,
    badRequest,
    serverError
  };
