// components/handwriting/SaveBoardButton.tsx
'use client';

import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Save, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useCanvasControl } from './CanvasStore';

type Props = {
  children?: React.ReactNode;                   // 按钮文案
  className?: string;
  onSaved?: () => void;                         // 成功回调
  disabled?: boolean;
  variant?: React.ComponentProps<typeof Button>['variant'];
  size?: React.ComponentProps<typeof Button>['size'];
  showIcon?: boolean;                           // 静止图标
  showSpinner?: boolean;                        // 加载时用旋转图标（无文字）
  loadingText?: string;                         // toast loading 文案
  successText?: string;                         // toast 成功文案
  errorText?: string;                           // toast 失败文案
};

export function SaveBoardButton({
  children,
  className,
  onSaved,
  disabled,
  variant = 'ghost',
  size = 'icon',
  showIcon = true,
  showSpinner = true,
  loadingText = '正在保存…',
  successText = '已保存',
  errorText = '保存失败，请重试',
}: Props) {
const { saveAll, manualSavers } = useCanvasControl();  const [loading, setLoading] = useState(false);

  const onClick = useCallback(async () => {
    const hasAny = Object.keys(manualSavers || {}).length > 0;
    if (!hasAny || loading || disabled) return;

    setLoading(true);
    const id = toast.loading(loadingText);

    try {
      await saveAll(); // 同时保存 main & side（若都已注册）
      toast.success(successText, { id });
      onSaved?.();
    } catch (e) {
      console.error('manual save failed:', e);
      toast.error(errorText, { id });
    } finally {
      setLoading(false);
    }
  }, [manualSavers, loading, disabled, loadingText, successText, errorText, onSaved]);

  return (
    <Button
      type="button"
      onClick={onClick}
disabled={loading || disabled || !Object.keys(manualSavers || {}).length}      className={className}
      variant={variant}
      size={size}
      aria-busy={loading}
    >
      {loading
        ? (showSpinner && <Loader2 className="h-4 w-4 animate-spin" />)
        : (showIcon && <Save className="h-4 w-4" />)
      }
      {children}
    </Button>
  );
}
