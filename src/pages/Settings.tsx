import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useCollections } from "@/hooks/useCollections";
import { cn } from "@/lib/utils";

const Settings = () => {
  const navigate = useNavigate();
  const { collections, deleteRequest, selectRequest } =
    useCollections();

  const savedRequests = useMemo(
    () =>
      collections.flatMap((collection) =>
        collection.requests.map((request) => ({
          collection,
          request,
        }))
      ),
    [collections]
  );

  const handleOpenRequest = (
    collectionId: string,
    requestId: string
  ) => {
    selectRequest(collectionId, requestId);
    navigate("/workspace");
  };

  const handleDelete = async (
    collectionId: string,
    requestId: string
  ) => {
    await deleteRequest(collectionId, requestId);
  };

  return (
    <div className="flex h-screen flex-col bg-background">
      <div className="border-b border-border px-6 py-8">
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Manage your profile, saved requests, and workspace
          preferences.
        </p>
      </div>

      <div className="flex-1 overflow-auto px-6 py-8">
        <Tabs defaultValue="saved-requests" className="space-y-6">
          <TabsList>
            <TabsTrigger value="saved-requests">
              Saved Requests
            </TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="preferences">Preferences</TabsTrigger>
          </TabsList>

          <TabsContent value="saved-requests" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>All saved requests</CardTitle>
                <CardDescription>
                  Quick access to every request stored in your
                  workspace.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {savedRequests.length === 0 ? (
                  <div className="rounded border border-dashed border-border px-6 py-12 text-center text-sm text-muted-foreground">
                    Nothing saved yet. Create a collection and add
                    requests from the left sidebar to see them here.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {savedRequests.map(({ collection, request }) => (
                      <div
                        key={request.id}
                        className="flex flex-col gap-4 rounded-lg border border-border p-4 transition hover:border-primary sm:flex-row sm:items-center"
                      >
                        <div className="flex flex-1 flex-col gap-2">
                          <div className="flex flex-wrap items-center gap-3">
                            <Badge
                              variant="secondary"
                              className="font-mono text-xs"
                            >
                              {collection.name}
                            </Badge>
                            <Badge
                              className={cn(
                                "font-mono text-xs",
                                request.method === "GET" &&
                                  "bg-emerald-500/10 text-emerald-400",
                                request.method === "POST" &&
                                  "bg-primary/10 text-primary",
                                request.method === "PUT" &&
                                  "bg-blue-500/10 text-blue-400",
                                request.method === "DELETE" &&
                                  "bg-destructive/10 text-destructive"
                              )}
                            >
                              {request.method}
                            </Badge>
                            <span className="font-semibold">
                              {request.name}
                            </span>
                          </div>
                          <p className="truncate text-xs text-muted-foreground">
                            {request.url}
                          </p>
                        </div>
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() =>
                              handleOpenRequest(
                                collection.id,
                                request.id
                              )
                            }
                          >
                            Open in workspace
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() =>
                              void handleDelete(
                                collection.id,
                                request.id
                              )
                            }
                          >
                            Delete
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>Profile</CardTitle>
                <CardDescription>
                  Workspace identity and account preferences.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <p className="text-xs uppercase text-muted-foreground/70">
                      Name
                    </p>
                    <p className="text-sm font-medium">
                      Alex Johnson
                    </p>
                  </div>
                  <Separator />
                  <div>
                    <p className="text-xs uppercase text-muted-foreground/70">
                      Email
                    </p>
                    <p className="text-sm font-medium">
                      alex.johnson@example.com
                    </p>
                  </div>
                </div>
                <Separator />
                <p className="text-xs text-muted-foreground">
                  Replace these placeholders by wiring the profile tab
                  to your authentication backend.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="preferences">
            <Card>
              <CardHeader>
                <CardTitle>Preferences</CardTitle>
                <CardDescription>
                  Global tweaks for the API Haven workspace.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 text-sm text-muted-foreground">
                <p>
                  Hook this section to your backend or local settings
                  store to persist theme, layout, and experimentation
                  toggles across devices.
                </p>
                <p>
                  For example, keep a <code>settings</code> collection
                  in MongoDB alongside your profile data, then surface
                  the stored flags here with toggle components from
                  the UI library.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Settings;
