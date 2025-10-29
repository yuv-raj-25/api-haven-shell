import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  createCollection as createCollectionRequest,
  createRequest as createRequestRequest,
  deleteCollection as deleteCollectionRequest,
  deleteRequest as deleteRequestRequest,
  fetchCollections,
  updateRequest as updateRequestRequest,
} from "@/api/collections";
import type { ApiRequest, Collection } from "@/types/collections";
import {
  CollectionsContext,
  type CollectionsContextValue,
  type CreateRequestInput,
  type UpdateRequestInput,
} from "@/context/CollectionsContext";
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

interface CollectionsProviderProps {
  children: ReactNode;
}

const COLLECTIONS_QUERY_KEY = ["collections"];

const sampleCollections: Collection[] = [
  {
    id: "sample-1",
    name: "User Management",
    requests: [
      {
        id: "sample-1-req-1",
        name: "Get Users",
        method: "GET",
        url: "https://api.example.com/users",
        params: [],
        headers: [
          {
            id: "h1",
            key: "Content-Type",
            value: "application/json",
          },
        ],
        body: "",
      },
      {
        id: "sample-1-req-2",
        name: "Create User",
        method: "POST",
        url: "https://api.example.com/users",
        params: [],
        headers: [
          {
            id: "h2",
            key: "Content-Type",
            value: "application/json",
          },
        ],
        body: '{\n  "name": "John Doe"\n}',
      },
    ],
  },
  {
    id: "sample-2",
    name: "Authentication",
    requests: [
      {
        id: "sample-2-req-1",
        name: "Login",
        method: "POST",
        url: "https://api.example.com/auth/login",
        params: [],
        headers: [
          {
            id: "h3",
            key: "Content-Type",
            value: "application/json",
          },
        ],
        body: '{\n  "email": "user@example.com",\n  "password": "password"\n}',
      },
    ],
  },
];

export const CollectionsProvider = ({
  children,
}: CollectionsProviderProps) => {
  const queryClient = useQueryClient();
  const [selectedCollectionId, setSelectedCollectionId] = useState<
    string | null
  >(null);
  const [selectedRequestId, setSelectedRequestId] = useState<
    string | null
  >(null);

  const {
    data: collections = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: COLLECTIONS_QUERY_KEY,
    queryFn: async () => {
      try {
        const data = await fetchCollections();
        return data;
      } catch (err) {
        console.warn("Falling back to sample collections:", err);
        return sampleCollections;
      }
    },
  });

  const createCollectionMutation = useMutation({
    mutationFn: createCollectionRequest,
    onSuccess: (newCollection) => {
      queryClient.setQueryData<Collection[]>(
        COLLECTIONS_QUERY_KEY,
        (prev = []) => [newCollection, ...prev]
      );
      setSelectedCollectionId(newCollection.id);
      const firstRequest = newCollection.requests?.[0];
      setSelectedRequestId(firstRequest ? firstRequest.id : null);
    },
  });

  const deleteCollectionMutation = useMutation({
    mutationFn: deleteCollectionRequest,
    onSuccess: (_, collectionId) => {
      let filtered: Collection[] = [];
      queryClient.setQueryData<Collection[]>(
        COLLECTIONS_QUERY_KEY,
        (prev = []) => {
          filtered = prev.filter(
            (collection) => collection.id !== collectionId
          );
          return filtered;
        }
      );
      if (selectedCollectionId === collectionId) {
        const fallback = filtered[0];
        setSelectedCollectionId(fallback?.id ?? null);
        setSelectedRequestId(fallback?.requests[0]?.id ?? null);
      }
    },
  });

  const createRequestMutation = useMutation({
    mutationFn: ({
      collectionId,
      payload,
    }: {
      collectionId: string;
      payload: CreateRequestInput;
    }) => createRequestRequest(collectionId, payload),
    onSuccess: (newRequest, variables) => {
      queryClient.setQueryData<Collection[]>(
        COLLECTIONS_QUERY_KEY,
        (prev = []) =>
          prev.map((collection) =>
            collection.id === variables.collectionId
              ? {
                  ...collection,
                  requests: [...collection.requests, newRequest],
                }
              : collection
          )
      );
      setSelectedCollectionId(variables.collectionId);
      setSelectedRequestId(newRequest.id);
    },
  });

  const updateRequestMutation = useMutation({
    mutationFn: ({
      collectionId,
      requestId,
      payload,
    }: {
      collectionId: string;
      requestId: string;
      payload: UpdateRequestInput;
    }) => updateRequestRequest(collectionId, requestId, payload),
    onSuccess: (updatedRequest, variables) => {
      queryClient.setQueryData<Collection[]>(
        COLLECTIONS_QUERY_KEY,
        (prev = []) =>
          prev.map((collection) =>
            collection.id === variables.collectionId
              ? {
                  ...collection,
                  requests: collection.requests.map((request) =>
                    request.id === variables.requestId
                      ? updatedRequest
                      : request
                  ),
                }
              : collection
          )
      );
    },
  });

  const deleteRequestMutation = useMutation({
    mutationFn: ({
      collectionId,
      requestId,
    }: {
      collectionId: string;
      requestId: string;
    }) => deleteRequestRequest(collectionId, requestId),
    onSuccess: (_, variables) => {
      let updatedCollection: Collection | undefined;
      queryClient.setQueryData<Collection[]>(
        COLLECTIONS_QUERY_KEY,
        (prev = []) =>
          prev.map((collection) => {
            if (collection.id !== variables.collectionId) {
              return collection;
            }
            const nextRequests = collection.requests.filter(
              (request) => request.id !== variables.requestId
            );
            updatedCollection = {
              ...collection,
              requests: nextRequests,
            };
            return updatedCollection;
          })
      );
      if (selectedRequestId === variables.requestId) {
        setSelectedRequestId(
          updatedCollection?.requests[0]?.id ?? null
        );
      }
    },
  });

  useEffect(() => {
    if (collections.length === 0 || selectedCollectionId) {
      return;
    }
    const firstCollection = collections[0];
    setSelectedCollectionId(firstCollection.id);
    setSelectedRequestId(firstCollection.requests[0]?.id ?? null);
  }, [collections, selectedCollectionId]);

  const selectCollection = useCallback(
    (collectionId: string | null) => {
      setSelectedCollectionId(collectionId);
      if (!collectionId) {
        setSelectedRequestId(null);
        return;
      }

      const collection = collections.find(
        (item) => item.id === collectionId
      );
      if (collection) {
        setSelectedRequestId(collection.requests[0]?.id ?? null);
      }
    },
    [collections]
  );

  const selectRequest = useCallback(
    (collectionId: string, requestId: string) => {
      setSelectedCollectionId(collectionId);
      setSelectedRequestId(requestId);
    },
    []
  );

  const createCollection = useCallback(
    async (name: string) => {
      await createCollectionMutation.mutateAsync({ name });
    },
    [createCollectionMutation]
  );

  const deleteCollection = useCallback(
    async (collectionId: string) => {
      await deleteCollectionMutation.mutateAsync(collectionId);
    },
    [deleteCollectionMutation]
  );

  const createRequest = useCallback(
    async (collectionId: string, payload: CreateRequestInput) => {
      try {
        const newRequest = await createRequestMutation.mutateAsync({
          collectionId,
          payload,
        });
        return newRequest;
      } catch (error) {
        console.error("Failed to create request", error);
        return null;
      }
    },
    [createRequestMutation]
  );

  const updateRequest = useCallback(
    async (
      collectionId: string,
      requestId: string,
      payload: UpdateRequestInput
    ) => {
      try {
        const updated = await updateRequestMutation.mutateAsync({
          collectionId,
          requestId,
          payload,
        });
        return updated;
      } catch (error) {
        console.error("Failed to update request", error);
        return null;
      }
    },
    [updateRequestMutation]
  );

  const deleteRequest = useCallback(
    async (collectionId: string, requestId: string) => {
      await deleteRequestMutation.mutateAsync({
        collectionId,
        requestId,
      });
    },
    [deleteRequestMutation]
  );

  const value = useMemo<CollectionsContextValue>(
    () => ({
      collections,
      isLoading,
      error,
      selectedCollectionId,
      selectedRequestId,
      selectCollection,
      selectRequest,
      createCollection,
      deleteCollection,
      createRequest,
      updateRequest,
      deleteRequest,
    }),
    [
      collections,
      isLoading,
      error,
      selectedCollectionId,
      selectedRequestId,
      selectCollection,
      selectRequest,
      createCollection,
      deleteCollection,
      createRequest,
      updateRequest,
      deleteRequest,
    ]
  );

  return (
    <CollectionsContext.Provider value={value}>
      {children}
    </CollectionsContext.Provider>
  );
};
