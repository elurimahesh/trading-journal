
import Header from "@/components/Layouts/Header";
import Sidenav from "@/components/Layouts/Sidebar";

export default function Home() {
  return (
    <main className="grid gap-4 p-4 grid-cols-[220px,_1fr]">
     <div style={{ display: 'flex' }}>
          <Sidenav />
          <div style={{ flex: 1 }}>
            <Header />
          </div>
        </div>
    </main>
  );
}
