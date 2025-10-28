import { ChevronRight, ChevronDown, Folder, File, Plus, Search } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface Collection {
  id: string;
  name: string;
  requests: Request[];
  expanded?: boolean;
}

interface Request {
  id: string;
  name: string;
  method: string;
}

const mockCollections: Collection[] = [
  {
    id: "1",
    name: "User Management",
    expanded: true,
    requests: [
      { id: "1", name: "Get Users", method: "GET" },
      { id: "2", name: "Create User", method: "POST" },
      { id: "3", name: "Update User", method: "PUT" },
      { id: "4", name: "Delete User", method: "DELETE" },
    ],
  },
  {
    id: "2",
    name: "Authentication",
    expanded: false,
    requests: [
      { id: "5", name: "Login", method: "POST" },
      { id: "6", name: "Logout", method: "POST" },
      { id: "7", name: "Refresh Token", method: "POST" },
    ],
  },
  {
    id: "3",
    name: "Products",
    expanded: false,
    requests: [
      { id: "8", name: "List Products", method: "GET" },
      { id: "9", name: "Get Product", method: "GET" },
      { id: "10", name: "Create Product", method: "POST" },
    ],
  },
];

const methodColors: Record<string, string> = {
  GET: "text-green-500",
  POST: "text-primary",
  PUT: "text-blue-500",
  DELETE: "text-destructive",
  PATCH: "text-yellow-500",
};

export const Sidebar = () => {
  const [collections, setCollections] = useState<Collection[]>(mockCollections);
  const [searchQuery, setSearchQuery] = useState("");

  const toggleCollection = (id: string) => {
    setCollections(
      collections.map((col) =>
        col.id === id ? { ...col, expanded: !col.expanded } : col
      )
    );
  };

  return (
    <motion.aside
      initial={{ x: -300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="w-64 bg-sidebar border-r border-sidebar-border h-screen flex flex-col"
    >
      <div className="p-4 border-b border-sidebar-border">
        <div className="flex items-center gap-2 mb-3">
          <h2 className="text-sm font-semibold text-sidebar-foreground">Collections</h2>
          <Button size="icon" variant="ghost" className="h-6 w-6 ml-auto">
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
        {collections.map((collection) => (
          <div key={collection.id} className="mb-1">
            <button
              onClick={() => toggleCollection(collection.id)}
              className="w-full flex items-center gap-2 px-2 py-1.5 rounded hover:bg-sidebar-accent text-sm text-sidebar-foreground transition-colors"
            >
              {collection.expanded ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
              <Folder className="h-4 w-4 text-primary" />
              <span className="flex-1 text-left">{collection.name}</span>
            </button>

            <AnimatePresence>
              {collection.expanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="ml-4 overflow-hidden"
                >
                  {collection.requests.map((request) => (
                    <button
                      key={request.id}
                      className="w-full flex items-center gap-2 px-2 py-1.5 rounded hover:bg-sidebar-accent text-sm text-sidebar-foreground transition-colors group"
                    >
                      <File className="h-3.5 w-3.5 text-muted-foreground" />
                      <span className={`text-xs font-medium ${methodColors[request.method]}`}>
                        {request.method}
                      </span>
                      <span className="flex-1 text-left text-xs truncate">
                        {request.name}
                      </span>
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </motion.aside>
  );
};
