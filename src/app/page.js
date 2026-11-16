// src/app/page.js ya src/app/admin/page.js
import { redirect } from "next/navigation";


export default function Home() {
  redirect("/admin/login");
}