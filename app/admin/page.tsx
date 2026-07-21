import { redirect } from "next/navigation";

/** /admin -> dashboard (the auth guard bounces to /admin/login if signed out). */
export default function AdminIndex() {
  redirect("/admin/dashboard");
}
