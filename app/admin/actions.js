"use server";

import { createAdminSupabase } from "@/lib/supabase/admin";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

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

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
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

// US-08: Tambah produk (harus terkunci login)
export async function tambahProdukAction(prevState, formData) {
  const supabase = await createAdminSupabase();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { error: "Akses ditolak: harap login sebagai admin." };
  }

  const nama = formData.get("nama")?.trim();
  const harga = parseInt(formData.get("harga"), 10);
  const kategori = formData.get("kategori")?.trim() || null;
  const foto_url = formData.get("foto_url")?.trim() || null;
  const deskripsi = formData.get("deskripsi")?.trim() || null;

  if (!nama || isNaN(harga) || harga < 0) {
    return { error: "Nama dan harga (>= 0) wajib diisi." };
  }

  const { error } = await supabase.from("produk").insert({
    nama,
    harga,
    kategori,
    foto_url,
    deskripsi,
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/");
  revalidatePath("/admin");
  redirect("/admin");
}

// US-09: Ubah produk (harus terkunci login)
export async function ubahProdukAction(prevState, formData) {
  const supabase = await createAdminSupabase();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { error: "Akses ditolak: harap login sebagai admin." };
  }

  const id = formData.get("id");
  const nama = formData.get("nama")?.trim();
  const harga = parseInt(formData.get("harga"), 10);
  const kategori = formData.get("kategori")?.trim() || null;
  const foto_url = formData.get("foto_url")?.trim() || null;
  const deskripsi = formData.get("deskripsi")?.trim() || null;

  if (!id || !nama || isNaN(harga) || harga < 0) {
    return { error: "Data produk tidak lengkap atau tidak valid." };
  }

  const { error } = await supabase
    .from("produk")
    .update({
      nama,
      harga,
      kategori,
      foto_url,
      deskripsi,
    })
    .eq("id", id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/");
  revalidatePath(`/produk/${id}`);
  revalidatePath("/admin");
  redirect("/admin");
}

// US-10: Hapus produk (harus terkunci login)
export async function hapusProdukAction(formData) {
  const supabase = await createAdminSupabase();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error("Akses ditolak: harap login sebagai admin.");
  }

  const id = formData.get("id");
  if (!id) {
    throw new Error("ID produk tidak ditemukan.");
  }

  const { error } = await supabase.from("produk").delete().eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/");
  revalidatePath("/admin");
}

// US-14: Deskripsi produk dibuat AI (Gemini API)
export async function buatDeskripsiAIAction(nama, kategori) {
  const supabase = await createAdminSupabase();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { error: "Akses ditolak: harap login sebagai admin." };
  }

  if (!nama) {
    return { error: "Nama produk harus diisi terlebih dahulu." };
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (apiKey) {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: `Buatkan deskripsi produk yang menarik, singkat (1-2 kalimat), dan menggugah minat pembeli untuk katalog UMKM.\nNama Produk: ${nama}\nKategori: ${kategori || "-"}\nJawab langsung teks deskripsinya saja tanpa tanda kutip.`,
                  },
                ],
              },
            ],
          }),
        }
      );
      const data = await response.json();
      const generatedText = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
      if (generatedText) {
        return { deskripsi: generatedText };
      }
    } catch (err) {
      console.error("Gemini API error:", err);
    }
  }

  // Deskripsi otomatis jika API key belum diisi atau offline
  return {
    deskripsi: `${nama} berkualitas dari kategori ${kategori || "unggulan"}. Diproses dengan standar terbaik untuk memberikan pengalaman dan kepuasan maksimal bagi pelanggan.`,
  };
}
