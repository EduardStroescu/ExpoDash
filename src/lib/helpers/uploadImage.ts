import * as FileSystem from "expo-file-system";
import { randomUUID } from "expo-crypto";
import { decode } from "base64-arraybuffer";
import { supabase } from "../supabase/supabase";

export const uploadProductImageMobile = async (image: string | null) => {
  if (!image?.startsWith("file://")) {
    return;
  }

  const base64 = await FileSystem.readAsStringAsync(image, {
    encoding: "base64",
  });
  const filePath = `${randomUUID()}.png`;
  const contentType = "image/png";
  const { data, error } = await supabase.storage
    .from("product-images")
    .upload(filePath, decode(base64), { contentType });

  if (data) {
    return data.path;
  }
};

export const uploadProductImageWeb = async (image: string | null) => {
  if (!image) {
    return;
  }

  const filePath = `${randomUUID()}.png`;
  const contentType = "image/png";
  const { data, error } = await supabase.storage
    .from("product-images")
    .upload(filePath, decode(image.split(",")[1]), { contentType });

  if (data) {
    return data.path;
  }
};

export const uploadUserAvatarMobile = async (image: string | null) => {
  if (!image?.startsWith("file://")) {
    return;
  }

  const base64 = await FileSystem.readAsStringAsync(image, {
    encoding: "base64",
  });
  const filePath = `${randomUUID()}.png`;
  const contentType = "image/png";
  const { data, error } = await supabase.storage
    .from("user-avatars")
    .upload(filePath, decode(base64), { contentType });

  if (data) {
    return data.path;
  }
};

export const uploadUserAvatarWeb = async (image: string | null) => {
  if (!image) {
    return;
  }

  const filePath = `${randomUUID()}.png`;
  const contentType = "image/png";
  const { data, error } = await supabase.storage
    .from("user-avatars")
    .upload(filePath, decode(image.split(",")[1]), { contentType });

  if (data) {
    return data.path;
  }
};
