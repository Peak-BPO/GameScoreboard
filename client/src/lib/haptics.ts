import { Capacitor } from "@capacitor/core";
import { Haptics, ImpactStyle, NotificationType } from "@capacitor/haptics";

const isNative = Capacitor.isNativePlatform();

/** Light tap feedback for button presses. Safe no-op on web. */
export async function hapticTap() {
  if (!isNative) return;
  try {
    await Haptics.impact({ style: ImpactStyle.Light });
  } catch {
    /* noop */
  }
}

/** Success feedback for saving a round / completing an action. Safe no-op on web. */
export async function hapticSuccess() {
  if (!isNative) return;
  try {
    await Haptics.notification({ type: NotificationType.Success });
  } catch {
    /* noop */
  }
}

/** Warning feedback for validation errors. Safe no-op on web. */
export async function hapticWarning() {
  if (!isNative) return;
  try {
    await Haptics.notification({ type: NotificationType.Warning });
  } catch {
    /* noop */
  }
}
