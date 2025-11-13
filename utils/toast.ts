import Toast from 'react-native-toast-message';

export type ToastType = 'success' | 'error' | 'info';

export const showToast = (
  type: ToastType,
  message: string,
  opts?: { description?: string; visibilityTime?: number }
) => {
  Toast.show({
    type,
    text1: message,
    text2: opts?.description,
    visibilityTime: opts?.visibilityTime ?? 2500,
    position: 'top',
    topOffset: 60,
  });
};

export const toastSuccess = (message: string, description?: string) =>
  showToast('success', message, { description });

export const toastError = (message: string, description?: string) =>
  showToast('error', message, { description, visibilityTime: 3500 });

export const toastInfo = (message: string, description?: string) =>
  showToast('info', message, { description });
