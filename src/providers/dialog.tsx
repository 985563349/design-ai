'use client';

import { createContext, useContext, useRef, useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface DialogConfig {
  open: boolean;
  title: React.ReactNode;
  body: React.ReactNode;
  cancelText?: string;
  actionText?: string;
}

interface DialogState extends DialogConfig {
  type: 'alert' | 'confirm';
}

export type AlertConfig = Pick<DialogConfig, 'title' | 'body' | 'actionText'>;

export type ConfirmConfig = Pick<DialogConfig, 'title' | 'body' | 'actionText' | 'cancelText'>;

interface DialogProviderState {
  alert: (config: AlertConfig) => Promise<unknown>;
  confirm: (config: ConfirmConfig) => Promise<unknown>;
}

const DialogProviderContext = createContext<DialogProviderState | null>(null);

export interface DialogProviderProps {
  children: React.ReactNode;
}

export function DialogProvider({ children }: DialogProviderProps) {
  const [state, setState] = useState<DialogState>({
    open: false,
    title: '',
    body: '',
    type: 'alert',
    cancelText: 'Cancel',
    actionText: 'Continue',
  });

  const resolveRef = useRef<(value?: unknown) => void>();
  const rejectRef = useRef<() => void>();

  const onAction = () => {
    setState((prevState) => ({ ...prevState, open: false }));
    resolveRef.current?.();
  };

  const onClose = () => {
    setState((prevState) => ({ ...prevState, open: false }));
    rejectRef.current?.();
  };

  const alert = (config: AlertConfig) => {
    setState((prevState) => ({ ...prevState, ...config, open: true, type: 'alert' }));

    return new Promise((resolve) => {
      resolveRef.current = resolve;
    });
  };

  const confirm = (config: ConfirmConfig) => {
    setState((prevState) => ({ ...prevState, ...config, open: true, type: 'confirm' }));

    return new Promise((resolve, reject) => {
      resolveRef.current = resolve;
      rejectRef.current = reject;
    });
  };

  return (
    <DialogProviderContext.Provider value={{ alert, confirm }}>
      {children}
      <AlertDialog open={state.open}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{state.title}</AlertDialogTitle>
            <AlertDialogDescription>{state.body}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            {state.type !== 'alert' && <AlertDialogCancel onClick={onClose}>{state.cancelText}</AlertDialogCancel>}
            <AlertDialogAction onClick={onAction}>{state.actionText}</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </DialogProviderContext.Provider>
  );
}

export function useDialog() {
  const context = useContext(DialogProviderContext);

  if (!context) {
    throw new Error('useDialog must be used within a DialogProvider');
  }

  return context;
}
