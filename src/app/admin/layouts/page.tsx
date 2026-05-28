import { redirect } from "next/navigation";

// This page has been removed - redirect to admin dashboard
export default function LayoutsRedirect() {
  redirect("/admin");
}
