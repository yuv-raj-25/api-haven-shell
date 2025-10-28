import { Sidebar } from "@/components/Sidebar";
import { Navbar } from "@/components/Navbar";
import { RequestWorkspace } from "@/components/RequestWorkspace";
import { ResponsePanel } from "@/components/ResponsePanel";

const Index = () => {
  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <RequestWorkspace />
          <ResponsePanel />
        </div>
      </div>
    </div>
  );
};

export default Index;
