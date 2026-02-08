import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { Prisma } from 'generated/prisma/client';

@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaExceptionFilter implements ExceptionFilter {
  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Database error';

    if (exception.code === 'P2002') {
      status = HttpStatus.CONFLICT;
      message = 'Unique constraint failed';
    }

    if (exception.code === 'P2025') {
      status = HttpStatus.NOT_FOUND;
      message = 'Record not found';
    }

    // console.error('Prisma error:', {
    //   name: exception.name,
    //   code: (exception as any).code,
    //   message: exception.message,
    //   meta: (exception as any).meta,
    // });

    res.status(status).json({
      statusCode: status,
      message,
    });
  }
}
