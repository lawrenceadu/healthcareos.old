import { http } from '@healthcare/utils';

// item category
export const createItemCategoryService = (payload: object) =>
  http.post<never, any>(`/item/category`, payload);

export const updateItemCategoryService = (payload: object, id: string) =>
  http.patch<never, any>(`/item/category/${id}`, payload);

export const deleteItemCategoryService = (id: string) =>
  http.delete<never, any>(`/item/category/${id}`);
// end of item category

// item
export const createItemService = (payload: object) =>
  http.post<never, any>(`/item`, payload);

export const updateItemService = (payload: object, id: string) =>
  http.patch<never, any>(`/item/${id}`, payload);

export const deleteItemService = (id: string) =>
  http.delete<never, any>(`/item/${id}`);
// end of item

// stock
export const createItemStockService = (payload: object) =>
  http.post<never, any>('/item/stock', payload);

export const updateItemStockService = (payload: object, id: string) =>
  http.patch<never, any>(`/item/stock/${id}`, payload);

export const updateItemStockStatusService = (payload: object, id: string) =>
  http.post<never, any>(`/item/stock/${id}`, payload);

export const deleteItemStockService = (id: string) =>
  http.delete<never, any>(`/item/stock/${id}`);
// end of stock

// request
export const createItemRequestService = (payload: object) =>
  http.post<never, any>('/item/issue', payload);

export const updateItemRequestService = (payload: object, id: string) =>
  http.patch<never, any>(`/item/issue/${id}`, payload);

export const updateItemRequestStatusService = (payload: object, id: string) =>
  http.post<never, any>(`/item/issue/${id}`, payload);

export const deleteItemRequestService = (id: string) =>
  http.delete<never, any>(`/item/issue/${id}`);
