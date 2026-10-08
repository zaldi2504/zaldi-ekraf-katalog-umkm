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

export async function gantiPasswordAction(prevState, formData) {
  const password_baru = formData.get("password_baru");
  const konfirmasi_password = formData.get("konfirmasi_password");

  if (!password_baru || password_baru.length < 8) {
    return { error: "Password baru minimal 8 karakter." };
  }

  if (password_baru !== konfirmasi_password) {
    return { error: "Konfirmasi password tidak cocok." };
  }

  const supabase = await createAdminSupabase();

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return { error: "Harap login terlebih dahulu." };
  }

  const { error } = await supabase.auth.updateUser({
    password: password_baru,
  });

  if (error) {
    return { error: error.message };
  }

  return { success: "Password berhasil diganti!" };
}

