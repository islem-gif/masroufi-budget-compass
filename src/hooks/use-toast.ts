
// Re-export from the components file
import { useToast as useToastComponent, toast as toastFunction } from "@/components/ui/use-toast";

export const useToast = useToastComponent;
export const toast = toastFunction;

export default useToast;
