import { AnchorHome } from "../components/AnchorHome.jsx";
import { Footer } from "../components/FooterTemp.jsx";
import { TaskBoard } from "../components/TaskBoard.jsx";

export function Dashboard() {
  return (
    <div className="min-h-screen flex flex-col bg-zinc-50 font-space text-zinc-900">
      <AnchorHome />

      <main className="flex-1">
        <TaskBoard />
      </main>

      <Footer />
    </div>
  );
}
