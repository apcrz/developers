import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable, map } from 'rxjs';

@Injectable()
export class PaginationInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const request = context.switchToHttp().getRequest();
        const response = context.switchToHttp().getResponse();

        const page = parseInt(request.query.page, 10) || 1;
        const perPage = parseInt(request.query.perPage, 10) || 25;

        return next.handle().pipe(
            map(data => {
                const totalItems = data.totalCount; 
                const totalPages = Math.ceil(totalItems / perPage);

                response.setHeader('X-Total-Count', totalItems.toString());
                response.setHeader('X-Total-Pages', totalPages.toString());
                response.setHeader('X-Current-Page', page.toString());
                response.setHeader('X-Per-Page', perPage.toString());

                return {
                    data: data.data,
                    meta: {
                        totalItems,
                        totalPages,
                        currentPage: page,
                        perPage
                    }
                };
            }),
        );
    }
}
