import { BreakingNews } from "./BreakingNews";
import { Header } from "./Header";

export function StickySiteHeader() {
  return (
    <div className="sticky top-0 z-50 bg-white">
      <Header />
      <BreakingNews />
    </div>
  );
}
