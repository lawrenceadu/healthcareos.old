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

// purchase
export const createItemPurchaseService = (payload: object) =>
  http.post<never, any>('/item/purchase', payload);

export const updateItemPurchaseService = (payload: object, id: string) =>
  http.patch<never, any>(`/item/purchase/${id}`, payload);

export const updateItemPurchaseStatusService = (payload: object, id: string) =>
  http.post<never, any>(`/item/purchase/${id}`, payload);

export const deleteItemPurchaseService = (id: string) =>
  http.delete<never, any>(`/item/purchase/${id}`);
// end of purchase

// adjustment
export const createItemAdjustmentService = (payload: object) =>
  http.post<never, any>('/item/stock', payload);

export const updateItemAdjustmentService = (payload: object, id: string) =>
  http.patch<never, any>(`/item/stock/${id}`, payload);

export const updateItemAdjustmentStatusService = (
  payload: object,
  id: string
) => http.post<never, any>(`/item/stock/${id}`, payload);

export const deleteItemAdjustmentService = (id: string) =>
  http.delete<never, any>(`/item/stock/${id}`);
// end of adjustment

// request
export const createItemRequestService = (payload: object) =>
  http.post<never, any>('/item/issue', payload);

export const updateItemRequestService = (payload: object, id: string) =>
  http.patch<never, any>(`/item/issue/${id}`, payload);

export const updateItemRequestStatusService = (payload: object, id: string) =>
  http.post<never, any>(`/item/issue/${id}`, payload);

export const deleteItemRequestService = (id: string) =>
  http.delete<never, any>(`/item/issue/${id}`);
// end of request

// transfer
export const createItemTransferService = (payload: object) =>
  http.post<never, any>('/item/transfer', payload);

export const updateItemTransferService = (payload: object, id: string) =>
  http.patch<never, any>(`/item/transfer/${id}`, payload);

export const updateItemTransferStatusService = (payload: object, id: string) =>
  http.post<never, any>(`/item/transfer/${id}`, payload);

export const deleteItemTransferService = (id: string) =>
  http.delete<never, any>(`/item/transfer/${id}`);
// end of transfer
