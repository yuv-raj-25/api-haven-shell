import {
  ChevronRight,
  ChevronDown,
  Folder,
  File,
  PenLine,
  Plus,
  Search,
  Trash2,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCollections } from "@/hooks/useCollections";
import type { ApiRequest, HttpMethod } from "@/types/collections";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

const methodColors: Record<HttpMethod, string> = {
  GET: "text-green-500",
  POST: "text-primary",
  PUT: "text-blue-500",
  DELETE: "text-destructive",
  PATCH: "text-yellow-500",
  HEAD: "text-muted-foreground",
  OPTIONS: "text-muted-foreground",
  TRACE: "text-muted-foreground",
};

export const Sidebar = () => {
  const {
    collections,
    isLoading,
    createCollection,
    deleteCollection,
    createRequest,
    updateRequest,
    deleteRequest,
    selectRequest,
    selectedCollectionId,
    selectedRequestId,
  } = useCollections();
  const { toast } = useToast();

  const [searchQuery, setSearchQuery] = useState("");
  const [expandedCollections, setExpandedCollections] = useState<
    Record<string, boolean>
  >({});
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState("");
  const [collectionPendingDeletion, setCollectionPendingDeletion] =
    useState<{ id: string; name: string } | null>(null);
  const [requestDialogState, setRequestDialogState] = useState<
    | null
    | {
        mode: "create";
        collectionId: string;
      }
    | {
        mode: "edit";
        collectionId: string;
        requestId: string;
      }
  >(null);
  const [requestFormState, setRequestFormState] = useState<{
    name: string;
    method: HttpMethod;
  }>({
    name: "",
    method: "GET",
  });
  const [requestPendingDeletion, setRequestPendingDeletion] =
    useState<null | {
      collectionId: string;
      requestId: string;
      requestName: string;
    }>(null);

  useEffect(() => {
    setExpandedCollections((prev) => {
      const next = { ...prev };
      collections.forEach((collection, index) => {
        if (next[collection.id] === undefined) {
          next[collection.id] = index === 0;
        }
      });
      return next;
    });
  }, [collections]);

  useEffect(() => {
    if (selectedCollectionId) {
      setExpandedCollections((prev) => ({
        ...prev,
        [selectedCollectionId]: true,
      }));
    }
  }, [selectedCollectionId]);

  const toggleCollection = (collectionId: string) => {
    setExpandedCollections((prev) => ({
      ...prev,
      [collectionId]: !prev[collectionId],
    }));
  };

  const handleCreateCollection = async () => {
    const trimmedName = newCollectionName.trim();
    if (!trimmedName) {
      return;
    }

    let success = false;
    try {
      await createCollection(trimmedName);
      toast({
        title: "Collection created",
        description: `"${trimmedName}" is ready for new requests.`,
      });
      success = true;
    } catch (error) {
      console.error("Failed to create collection", error);
      toast({
        title: "Creation failed",
        description:
          "We couldn't create the collection. Please try again.",
        variant: "destructive",
      });
    }

    if (success) {
      setNewCollectionName("");
      setIsCreateDialogOpen(false);
    }
  };

  const handleDeleteCollection = async () => {
    if (!collectionPendingDeletion) {
      return;
    }

    try {
      await deleteCollection(collectionPendingDeletion.id);
      toast({
        title: "Collection deleted",
        description: `"${collectionPendingDeletion.name}" was removed.`,
      });
    } catch (error) {
      console.error("Failed to delete collection", error);
      toast({
        title: "Deletion failed",
        description:
          "We couldn't delete the collection. Please try again.",
        variant: "destructive",
      });
    } finally {
      setCollectionPendingDeletion(null);
    }
  };

  const openCreateRequestDialog = (collectionId: string) => {
    setRequestDialogState({ mode: "create", collectionId });
    setRequestFormState({ name: "", method: "GET" });
    setExpandedCollections((prev) => ({
      ...prev,
      [collectionId]: true,
    }));
  };

  const openEditRequestDialog = (
    collectionId: string,
    request: ApiRequest
  ) => {
    setRequestDialogState({
      mode: "edit",
      collectionId,
      requestId: request.id,
    });
    setRequestFormState({
      name: request.name,
      method: request.method,
    });
  };

  const saveRequest = async () => {
    if (!requestDialogState) {
      return;
    }

    const trimmedName = requestFormState.name.trim();
    if (!trimmedName) {
      return;
    }

    let success = false;

    if (requestDialogState.mode === "create") {
      try {
        const newRequest = await createRequest(
          requestDialogState.collectionId,
          {
            name: trimmedName,
            method: requestFormState.method,
            url: "",
            params: [],
            headers: [],
          }
        );
        success = Boolean(newRequest);
        if (success) {
          toast({
            title: "Request created",
            description: `${requestFormState.method} ${trimmedName} is ready to edit.`,
          });
        } else {
          toast({
            title: "Creation failed",
            description:
              "We couldn't create the request. Please try again.",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error("Failed to create request", error);
        toast({
          title: "Creation failed",
          description:
            "We couldn't create the request. Please try again.",
          variant: "destructive",
        });
        return;
      }
    } else {
      const collection = collections.find(
        (col) => col.id === requestDialogState.collectionId
      );
      const existingRequest = collection?.requests.find(
        (req) => req.id === requestDialogState.requestId
      );

      if (!collection || !existingRequest) {
        setRequestDialogState(null);
        toast({
          title: "Request not found",
          description:
            "The request no longer exists. Refresh and try again.",
          variant: "destructive",
        });
        return;
      }

      try {
        const updated = await updateRequest(
          collection.id,
          existingRequest.id,
          {
            name: trimmedName,
            method: requestFormState.method,
            url: existingRequest.url,
            params: existingRequest.params,
            headers: existingRequest.headers,
            body: existingRequest.body,
            description: existingRequest.description,
          }
        );
        success = Boolean(updated);
        if (success) {
          toast({
            title: "Request updated",
            description: `${requestFormState.method} ${trimmedName} saved successfully.`,
          });
        } else {
          toast({
            title: "Update failed",
            description:
              "We couldn't save the request changes. Please try again.",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error("Failed to update request", error);
        toast({
          title: "Update failed",
          description:
            "We couldn't save the request changes. Please try again.",
          variant: "destructive",
        });
        return;
      }
    }

    if (success) {
      setRequestDialogState(null);
      setRequestFormState({ name: "", method: "GET" });
    }
  };

  const handleDeleteRequest = async () => {
    if (!requestPendingDeletion) {
      return;
    }

    try {
      await deleteRequest(
        requestPendingDeletion.collectionId,
        requestPendingDeletion.requestId
      );
      toast({
        title: "Request deleted",
        description: `${requestPendingDeletion.requestName} was removed.`,
      });
    } catch (error) {
      console.error("Failed to delete request", error);
      toast({
        title: "Deletion failed",
        description:
          "We couldn't delete the request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setRequestPendingDeletion(null);
    }
  };

  const filteredCollections = useMemo(() => {
    const lowerQuery = searchQuery.trim().toLowerCase();

    if (!lowerQuery) {
      return collections;
    }

    return collections.filter((collection) =>
      collection.name.toLowerCase().includes(lowerQuery)
    );
  }, [collections, searchQuery]);

  return (
    <motion.aside
      initial={{ x: -300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="w-64 bg-sidebar border-r border-sidebar-border h-screen flex flex-col"
    >
      <div className="p-4 border-b border-sidebar-border">
        <div className="flex items-center gap-2 mb-3">
          <h2 className="text-sm font-semibold text-sidebar-foreground">
            Collections
          </h2>
          <Button
            size="icon"
            variant="ghost"
            className="h-6 w-6 ml-auto"
            onClick={() => setIsCreateDialogOpen(true)}
            aria-label="Create collection"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8 h-9 bg-sidebar-accent"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        {isLoading ? (
          <div className="px-2 py-6 text-center text-xs text-muted-foreground">
            Loading collections...
          </div>
        ) : filteredCollections.length === 0 ? (
          <div className="px-2 py-6 text-center text-xs text-muted-foreground">
            {collections.length === 0
              ? "Create your first collection to get started"
              : "No collections match your search"}
          </div>
        ) : (
          filteredCollections.map((collection) => (
            <div key={collection.id} className="mb-1">
              <div className="group flex items-center rounded hover:bg-sidebar-accent text-sm text-sidebar-foreground transition-colors">
                <button
                  onClick={() => toggleCollection(collection.id)}
                  className="flex flex-1 items-center gap-2 px-2 py-1.5 text-left"
                  aria-expanded={Boolean(
                    expandedCollections[collection.id]
                  )}
                >
                  {expandedCollections[collection.id] ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                  <Folder className="h-4 w-4 text-primary" />
                  <span className="flex-1 truncate">
                    {collection.name}
                  </span>
                </button>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-7 w-7 shrink-0 opacity-0 transition-opacity group-hover:opacity-100"
                  onClick={(event) => {
                    event.stopPropagation();
                    openCreateRequestDialog(collection.id);
                  }}
                  aria-label={`Add request to ${collection.name}`}
                >
                  <Plus className="h-3.5 w-3.5" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-7 w-7 shrink-0 opacity-0 transition-opacity group-hover:opacity-100"
                  onClick={(event) => {
                    event.stopPropagation();
                    setCollectionPendingDeletion({
                      id: collection.id,
                      name: collection.name,
                    });
                  }}
                  aria-label={`Delete ${collection.name}`}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>

              <AnimatePresence>
                {expandedCollections[collection.id] && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="ml-4 overflow-hidden"
                  >
                    {collection.requests.length === 0 ? (
                      <div className="px-2 py-2 text-xs text-muted-foreground">
                        No requests yet
                      </div>
                    ) : (
                      collection.requests.map((request) => {
                        const isSelected =
                          selectedRequestId === request.id;
                        return (
                          <div
                            key={request.id}
                            role="button"
                            tabIndex={0}
                            onClick={() =>
                              selectRequest(collection.id, request.id)
                            }
                            onKeyDown={(event) => {
                              if (
                                event.key === "Enter" ||
                                event.key === " "
                              ) {
                                event.preventDefault();
                                selectRequest(
                                  collection.id,
                                  request.id
                                );
                              }
                            }}
                            className={cn(
                              "group/request flex items-center gap-2 rounded px-2 py-1.5 text-xs text-sidebar-foreground transition-colors hover:bg-sidebar-accent focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background",
                              isSelected && "bg-sidebar-accent/60"
                            )}
                          >
                            <File className="h-3.5 w-3.5 text-muted-foreground" />
                            <span
                              className={`font-mono font-semibold ${
                                methodColors[request.method] ??
                                "text-muted-foreground"
                              }`}
                            >
                              {request.method}
                            </span>
                            <span className="flex-1 truncate text-left">
                              {request.name}
                            </span>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-7 w-7 shrink-0 opacity-0 transition-opacity group-hover/request:opacity-100"
                              onClick={(event) => {
                                event.stopPropagation();
                                openEditRequestDialog(
                                  collection.id,
                                  request
                                );
                              }}
                              aria-label={`Rename ${request.name}`}
                            >
                              <PenLine className="h-3.5 w-3.5" />
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-7 w-7 shrink-0 opacity-0 transition-opacity group-hover/request:opacity-100"
                              onClick={(event) => {
                                event.stopPropagation();
                                setRequestPendingDeletion({
                                  collectionId: collection.id,
                                  requestId: request.id,
                                  requestName: request.name,
                                });
                              }}
                              aria-label={`Delete ${request.name}`}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        );
                      })
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))
        )}
      </div>

      <Dialog
        open={isCreateDialogOpen}
        onOpenChange={(open) => {
          setIsCreateDialogOpen(open);
          if (!open) {
            setNewCollectionName("");
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create collection</DialogTitle>
            <DialogDescription>
              Organize related requests together for faster access.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <label
              className="text-xs font-medium text-muted-foreground"
              htmlFor="collection-name"
            >
              Collection name
            </label>
            <Input
              id="collection-name"
              placeholder="e.g. User Management"
              value={newCollectionName}
              autoFocus
              onChange={(event) =>
                setNewCollectionName(event.target.value)
              }
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  handleCreateCollection();
                }
              }}
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsCreateDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateCollection}
              disabled={!newCollectionName.trim()}
            >
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={collectionPendingDeletion !== null}
        onOpenChange={(open) => {
          if (!open) {
            setCollectionPendingDeletion(null);
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete collection?</AlertDialogTitle>
            <AlertDialogDescription>
              {collectionPendingDeletion
                ? `This will permanently remove "${collectionPendingDeletion.name}" and all of its requests.`
                : "This will permanently remove the selected collection."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                void handleDeleteCollection();
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog
        open={requestDialogState !== null}
        onOpenChange={(open) => {
          if (!open) {
            setRequestDialogState(null);
            setRequestFormState({ name: "", method: "GET" });
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {requestDialogState?.mode === "edit"
                ? "Rename request"
                : "Create request"}
            </DialogTitle>
            <DialogDescription>
              Define the request name and method you want to use.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <label
                className="text-xs font-medium text-muted-foreground"
                htmlFor="request-name"
              >
                Request name
              </label>
              <Input
                id="request-name"
                placeholder="e.g. Get Users"
                value={requestFormState.name}
                autoFocus
                onChange={(event) =>
                  setRequestFormState((prev) => ({
                    ...prev,
                    name: event.target.value,
                  }))
                }
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    saveRequest();
                  }
                }}
              />
            </div>
            <div className="space-y-2">
              <label
                className="text-xs font-medium text-muted-foreground"
                htmlFor="request-method"
              >
                Method
              </label>
              <Select
                value={requestFormState.method}
                onValueChange={(value) =>
                  setRequestFormState((prev) => ({
                    ...prev,
                    method: value as HttpMethod,
                  }))
                }
              >
                <SelectTrigger
                  id="request-method"
                  className="w-40 font-mono font-semibold"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(Object.keys(methodColors) as HttpMethod[]).map(
                    (method) => (
                      <SelectItem
                        key={method}
                        value={method}
                        className="font-mono font-semibold"
                      >
                        {method}
                      </SelectItem>
                    )
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setRequestDialogState(null);
                setRequestFormState({ name: "", method: "GET" });
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={saveRequest}
              disabled={!requestFormState.name.trim()}
            >
              {requestDialogState?.mode === "edit"
                ? "Save changes"
                : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={requestPendingDeletion !== null}
        onOpenChange={(open) => {
          if (!open) {
            setRequestPendingDeletion(null);
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete request?</AlertDialogTitle>
            <AlertDialogDescription>
              {requestPendingDeletion
                ? `This will permanently remove "${requestPendingDeletion.requestName}" from the collection.`
                : "This will permanently remove the selected request."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                void handleDeleteRequest();
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </motion.aside>
  );
};
