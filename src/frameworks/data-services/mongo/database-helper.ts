/**
 * Rules for MONGODB Multi Document Transactions
 * All data modeling rules still applies
 * Transactions should be the most common operation
 * Pass in the session to all statements 
 * Implement retry logic , transactions can always abort
 * Plan for DDL operations
 */
import { Logger } from '@nestjs/common';
import { ClientSession } from 'mongoose';
import * as mongoose from 'mongoose';

/**
 * Source: https://docs.mongodb.com/manual/reference/method/Session.commitTransaction/
 */

const databaseHelper = {
  runTransactionWithRetry: async (txnFunc: any, session: ClientSession) => {
    try {
      let retries = 0
      while (retries < 3) {
        try {
          Logger.log("-------- runTransactionWithRetry function ----------")
          await txnFunc(session);  // performs transaction
          await session.commitTransaction(); // Uses write concern set at transaction start.
          Logger.log("-------- runTransactionWithRetry function ----------")
          Logger.log("Transaction commited.............")
          // commit transaction
          await session.endSession();
          break;
        } catch (error: any) {
          // If transient error, retry the whole transaction
          Logger.error("----------------error during commit ------------------")
          Logger.error(error)
          Logger.error("----------------error during commit ------------------")
          Logger.error(error.errorLabels)

          if (error.hasOwnProperty("errorLabels") && error.errorLabels.includes("TransientTransactionError")) {
            Logger.error("TransientTransactionError, retrying transaction ...");
            retries++
            continue;
          } else if (error.hasOwnProperty("errorLabels") && error.errorLabels.includes("UnknownTransactionCommitResult")) {
            Logger.error("UnknownTransactionCommitResult, retrying commit operation ...");
            retries++
            continue;
          } else {
            await session.abortTransaction();
            break;
            // throw new Error(error);
          }

        }
      }
    } catch (err) {
      throw new Error(err);
    }

  },
  executeTransaction: async (transactionProcess: any, connection: mongoose.Connection) => {
    const session = await connection.startSession();
    session.startTransaction();
    try {
      await databaseHelper.runTransactionWithRetry(transactionProcess, session);
    } catch (error: any) {
      throw new Error(error);
    } finally {
      await session.endSession();
    }

  },

  // queryDbByDateFilter: (query: { from?: string, to?: string }, dateField: string = 'createdAt') => {
  //   const to = query.to ? new Date(query.to) : query.to
  //   const from = query.from ? new Date(query.from) : query.from
  
  //   if (to && !from) return { [dateField]: <= to }
  //   if (!to && from) return { [dateField]: >= from }
  //   if (to && from) return { [dateField]: from, to }
  
  //   return {}
  
  // }
}

export default databaseHelper
