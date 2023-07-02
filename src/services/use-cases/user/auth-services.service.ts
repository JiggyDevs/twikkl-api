import { Injectable } from "@nestjs/common";
import { IDataServices } from "src/core/abstracts";

@Injectable()
export class AuthServices {
    constructor(
        private data: IDataServices
    )
    {}

    
}