import { sleep } from "@/Utils/utils";
import { useEffect, useState } from "react";

export interface AutoPrintOptions {
  enabled?: boolean;
  delay?: number;
  window?: Window;
  backDelay?: number;
}

/**
 * React hook to automatically trigger window.print() after a delay
 *
 * Usage:
 * ```
 * useAutoPrint({ enabled: !isLoading, delay: 1000 });
 * ```
 */
export default function useAutoPrint({
  enabled = true,
  delay = 300,
  window: printWindow = window,
  backDelay = 5000,
}: AutoPrintOptions) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [countdown, setCountdown] = useState<number | undefined>();

  useEffect(() => {
    if (enabled) {
      setIsProcessing(true);
      const timer = setTimeout(async () => {
        printWindow.print();
        // Give some time for the print dialog to appear before navigating back
        await sleep(300);
        setIsProcessing(false);

        if (backDelay > 0) {
          setCountdown(Math.ceil(backDelay / 1000));
        } else {
          window.history.go(-1);
        }
      }, delay); // Delay to ensure content is rendered

      return () => clearTimeout(timer);
    }
  }, [enabled, printWindow, backDelay, delay]);

  useEffect(() => {
    if (countdown === undefined || countdown <= 0) {
      if (countdown === 0) {
        window.history.go(-1);
      }
      return;
    }

    const timer = setTimeout(() => {
      setCountdown(countdown - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [countdown]);

  return {
    isPrinting: isProcessing,
    countdown,
    cancelCountdown: () => setCountdown(undefined),
  };
}
