/**
 * React Hook for Random Universe Cipher
 * 
 * Provides a React interface to the WASM-accelerated cipher
 * with web worker support for non-blocking encryption/decryption
 * and parallel processing for large files (2-3x faster on multi-core CPUs!)
 */

import { useState, useEffect, useCallback, useRef } from 'react';

interface WorkerMessage {
  type: 'encrypt' | 'decrypt';
  id: string;
  data: Uint8Array;
  password: string;
  useFast?: boolean;
}

interface WorkerResponse {
  type: 'success' | 'error' | 'progress';
  id: string;
  data?: Uint8Array;
  error?: string;
  progress?: number;
  message?: string;
}

interface CipherHook {
  encrypt: (data: Uint8Array, password: string, useFast?: boolean) => Promise<Uint8Array>;
  decrypt: (data: Uint8Array, password: string, useFast?: boolean) => Promise<Uint8Array>;
  encryptString: (text: string, password: string) => Promise<string>;
  decryptString: (encrypted: string, password: string) => Promise<string>;
  isReady: boolean;
  progress: number;
  progressMessage: string;
  timeElapsed: number;
  timeRemaining: number;
  lastOperationTime: number;
  error: string | null;
}

export function useRandomUniverseCipher(): CipherHook {
  const [worker, setWorker] = useState<Worker | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressMessage, setProgressMessage] = useState('');
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [lastOperationTime, setLastOperationTime] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const startTimeRef = useRef<number>(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const pendingCallbacks = useRef<Map<string, {
    resolve: (value: Uint8Array) => void;
    reject: (error: Error) => void;
  }>>(new Map());

  useEffect(() => {
    try {
      // Initialize Web Worker with WASM
      const cryptoWorker = new Worker(
        new URL('../lib/random-universe-cipher/worker/crypto-worker.ts', import.meta.url),
        { type: 'module' }
      );

      cryptoWorker.onmessage = (e: MessageEvent<WorkerResponse>) => {
        const { type, id, data, error: workerError, progress: workerProgress, message } = e.data;

        if (type === 'progress') {
          const currentProgress = workerProgress || 0;
          setProgress(currentProgress);
          setProgressMessage(message || '');
          
          // Calculate time elapsed and remaining
          if (startTimeRef.current > 0) {
            const elapsed = (Date.now() - startTimeRef.current) / 1000; // in seconds
            setTimeElapsed(elapsed);
            
            if (currentProgress > 0) {
              const totalTime = (elapsed / currentProgress) * 100;
              const remaining = totalTime - elapsed;
              setTimeRemaining(Math.max(0, remaining));
            }
          }
        } else if (type === 'success' && data) {
          const callbacks = pendingCallbacks.current.get(id);
          if (callbacks) {
            callbacks.resolve(data);
            pendingCallbacks.current.delete(id);
          }
          
          // Store final operation time before resetting
          if (startTimeRef.current > 0) {
            const finalTime = (Date.now() - startTimeRef.current) / 1000;
            setLastOperationTime(finalTime);
          }
          
          // Clear timer and reset
          if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
          }
          setProgress(0);
          setProgressMessage('');
          setTimeElapsed(0);
          setTimeRemaining(0);
          startTimeRef.current = 0;
          setError(null);
        } else if (type === 'error') {
          const callbacks = pendingCallbacks.current.get(id);
          if (callbacks) {
            callbacks.reject(new Error(workerError || 'Unknown error'));
            pendingCallbacks.current.delete(id);
          }
          
          // Clear timer and reset
          if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
          }
          setProgress(0);
          setProgressMessage('');
          setTimeElapsed(0);
          setTimeRemaining(0);
          startTimeRef.current = 0;
          setError(workerError || 'Unknown error');
        }
      };

      cryptoWorker.onerror = (e) => {
        setError(`Worker error: ${e.message}`);
        setIsReady(false);
      };

      setWorker(cryptoWorker);
      setIsReady(true);

      return () => {
        cryptoWorker.terminate();
      };
    } catch (err) {
      setError(`Failed to initialize worker: ${err instanceof Error ? err.message : String(err)}`);
      setIsReady(false);
    }
  }, []);

  const encrypt = useCallback(async (
    data: Uint8Array,
    password: string,
    useFast = true
  ): Promise<Uint8Array> => {
    // Start timer
    startTimeRef.current = Date.now();
    setTimeElapsed(0);
    setTimeRemaining(0);
    setError(null);

    // Use worker for all operations (worker handles fast methods internally)
    if (!worker || !isReady) {
      throw new Error('Cipher not ready');
    }

    return new Promise((resolve, reject) => {
      const id = Math.random().toString(36).substring(2);
      pendingCallbacks.current.set(id, { resolve, reject });

      // Use Transferable Objects for zero-copy transfer
      const message = {
        type: 'encrypt',
        id,
        data,
        password,
        useFast,
      } as WorkerMessage;
      
      // Transfer the ArrayBuffer ownership to avoid copying
      worker.postMessage(message, [data.buffer]);
    });
  }, [worker, isReady]);

  const decrypt = useCallback(async (
    data: Uint8Array,
    password: string,
    useFast = true
  ): Promise<Uint8Array> => {
    // Start timer
    startTimeRef.current = Date.now();
    setTimeElapsed(0);
    setTimeRemaining(0);
    setError(null);

    // Use worker for all operations (worker handles fast methods internally)
    if (!worker || !isReady) {
      throw new Error('Cipher not ready');
    }

    return new Promise((resolve, reject) => {
      const id = Math.random().toString(36).substring(2);
      pendingCallbacks.current.set(id, { resolve, reject });

      // Use Transferable Objects for zero-copy transfer
      const message = {
        type: 'decrypt',
        id,
        data,
        password,
        useFast,
      } as WorkerMessage;
      
      // Transfer the ArrayBuffer ownership to avoid copying
      worker.postMessage(message, [data.buffer]);
    });
  }, [worker, isReady]);

  const encryptString = useCallback(async (
    text: string,
    password: string
  ): Promise<string> => {
    // Use the worker for string encryption (handles AEAD automatically)
    const data = new TextEncoder().encode(text);
    const encrypted = await encrypt(data, password, false);
    // Convert to base64 for string output
    return btoa(String.fromCharCode(...encrypted));
  }, [encrypt]);

  const decryptString = useCallback(async (
    encrypted: string,
    password: string
  ): Promise<string> => {
    // Decode from base64 and use worker for decryption
    const data = Uint8Array.from(atob(encrypted), c => c.charCodeAt(0));
    const decrypted = await decrypt(data, password, false);
    return new TextDecoder().decode(decrypted);
  }, [decrypt]);

  return {
    encrypt,
    decrypt,
    encryptString,
    decryptString,
    isReady,
    progress,
    progressMessage,
    timeElapsed,
    timeRemaining,
    lastOperationTime,
    error,
  };
}

