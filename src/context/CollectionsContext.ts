import { createContext } from "react";
import type {
  ApiRequest,
  Collection,
  HttpMethod,
  KeyValuePair,
} from "@/types/collections";

export interface CreateRequestInput {
  name: string;
  method: HttpMethod;
  url: string;
  params: KeyValuePair[];
  headers: KeyValuePair[];
  body?: string;
  description?: string;
}

export type UpdateRequestInput = CreateRequestInput;

export interface CollectionsContextValue {
  collections: Collection[];
  isLoading: boolean;
  error: unknown;
  selectedCollectionId: string | null;
  selectedRequestId: string | null;
  selectCollection: (collectionId: string | null) => void;
  selectRequest: (collectionId: string, requestId: string) => void;
  createCollection: (name: string) => Promise<void>;
  deleteCollection: (collectionId: string) => Promise<void>;
  createRequest: (
    collectionId: string,
    payload: CreateRequestInput
  ) => Promise<ApiRequest | null>;
  updateRequest: (
    collectionId: string,
    requestId: string,
    payload: UpdateRequestInput
  ) => Promise<ApiRequest | null>;
  deleteRequest: (
    collectionId: string,
    requestId: string
  ) => Promise<void>;
}

export const CollectionsContext = createContext<
  CollectionsContextValue | undefined
>(undefined);
