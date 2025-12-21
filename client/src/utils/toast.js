import iziToast from "izitoast";
import "izitoast/dist/css/iziToast.min.css";

export const toastSuccess = (message, title = "Başarılı") =>
  iziToast.success({ title, message });

export const toastError = (message, title = "Hata") =>
  iziToast.error({ title, message });

export const toastWarn = (message, title = "Uyarı") =>
  iziToast.warning({ title, message });
