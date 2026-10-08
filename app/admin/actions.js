"use server";

import { createAdminSupabase } from "@/lib/supabase/admin";
import { redirect } from "next/navigation";

export async function loginAction(prevState, formData) {
  const email = formData.get("email");
  const password = formData.get("password");

  const supabase = await createAdminSupabase();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: error.message };
  }

  redirect("/admin");
}

export async function logoutAction() {
  const supabase = await createAdminSupabase();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

