// import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
// import { EventEmitter2 } from "@nestjs/event-emitter";
// import { NextFunction, Request, Response } from 'express';
// import Audit from 'src/core/entities/Audit';
// import { ActionType, State } from 'src/core/types/audit';
// import jwtLib from 'src/lib/jwtlib';

// const returnState = (code: number) => {
//   if (code >= 500) return State.ERROR;
//   if (code >= 400) return State.ERROR;
//   if (code >= 200) return State.SUCCESS;

// }
// @Injectable()
// class LogsMiddleware implements NestMiddleware {
//   private readonly logger = new Logger('HTTP');
//   constructor(private eventEmitter: EventEmitter2) { }

//   use(request: Request, response: Response, next: NextFunction) {
//     response.on('finish', async () => {
//       const { method, originalUrl, ip, headers } = request;
//       const { statusCode, statusMessage } = response;
//       const message = `${method} ${originalUrl} ${statusCode} ${statusMessage}`;
//       let token = request.headers.authorization
//       token = token ? token.replace('Bearer ', '') : null
//       const decoded = token ? await jwtLib.jwtVerify(token) : null;

//       const audit = new Audit()
//       audit.state = returnState(statusCode)
//       audit.action = message
//       audit.sourceIP = ip
//       audit.actionType = method as ActionType
//       audit.userId = decoded && !originalUrl.includes('/admin') ? decoded.id : null
//       audit.adminId = decoded && originalUrl.includes('/admin') ? decoded.id : null
//       audit.headers = JSON.stringify(headers)
//       audit.isAnonymous = decoded ? false : true
//       audit.method = method
//       audit.originalUrl = originalUrl
//       audit.statusCode = String(statusCode)
//       if (originalUrl === '/health') {
//         Logger.log("Connection alive")
//       } else {
//         this.eventEmitter.emit(
//           "es.create.audit",
//           audit
//         );
//       }

//       if (statusCode >= 500) return this.logger.error(message);
//       if (statusCode >= 400) return this.logger.error(message);
//       return this.logger.log(message);

//     });

//     next();
//   }
// }

// export default LogsMiddleware;