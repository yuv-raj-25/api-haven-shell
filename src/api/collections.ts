import { apiRequest } from "@/api/client";
import type {
  ApiRequest,
  Collection,
  HttpMethod,
  KeyValuePair,
} from "@/types/collections";

export interface UpsertCollectionPayload {
  name: string;
}

export interface UpsertRequestPayload {
  name: string;
  method: HttpMethod;
  url: string;
  params: KeyValuePair[];
  headers: KeyValuePair[];
  body?: string;
  description?: string;
}

export async function fetchCollections(): Promise<Collection[]> {
  return apiRequest<Collection[]>("/collections", {
    method: "GET",
  });
}

export async function createCollection(
  payload: UpsertCollectionPayload
): Promise<Collection> {
  return apiRequest<Collection>("/collections", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function deleteCollection(
  collectionId: string
): Promise<{ id: string }> {
  return apiRequest<{ id: string }>(`/collections/${collectionId}`, {
    method: "DELETE",
  });
}

export async function updateCollection(
  collectionId: string,
  payload: UpsertCollectionPayload
): Promise<Collection> {
  return apiRequest<Collection>(`/collections/${collectionId}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export async function createRequest(
  collectionId: string,
  payload: UpsertRequestPayload
): Promise<ApiRequest> {
  return apiRequest<ApiRequest>(
    `/collections/${collectionId}/requests`,
    {
      method: "POST",
      body: JSON.stringify(payload),
    }
  );
}

export async function updateRequest(
  collectionId: string,
  requestId: string,
  payload: UpsertRequestPayload
): Promise<ApiRequest> {
  return apiRequest<ApiRequest>(
    `/collections/${collectionId}/requests/${requestId}`,
    {
      method: "PATCH",
      body: JSON.stringify(payload),
    }
  );
}

export async function deleteRequest(
  collectionId: string,
  requestId: string
): Promise<{ id: string }> {
  return apiRequest<{ id: string }>(
    `/collections/${collectionId}/requests/${requestId}`,
    {
      method: "DELETE",
    }
  );
}
