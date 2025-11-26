declare module 'react-qr-reader' {
  import { FC } from 'react';

  interface QrReaderConstraints {
    video?: {
      facingMode?: 'user' | 'environment' | { exact: string };
      width?: number | { ideal?: number; max?: number; min?: number };
      height?: number | { ideal?: number; max?: number; min?: number };
      aspectRatio?: number;
    };
    audio?: boolean;
  }

  interface QrReaderResult {
    text: string;
    data?: string;
  }

  interface QrReaderProps {
    onResult: (result: QrReaderResult | null) => void;
    constraints?: QrReaderConstraints;
    className?: string;
    style?: React.CSSProperties;
    containerStyle?: React.CSSProperties;
    videoStyle?: React.CSSProperties;
    scanDelay?: number;
    videoId?: string;
  }

  export const QrReader: FC<QrReaderProps>;
  export default QrReader;
}

declare module 'react-qr-scanner' {
  import { FC } from 'react';

  interface QrScannerConstraints {
    video?: {
      facingMode?: 'user' | 'environment' | { exact: string };
      width?: number | { ideal?: number; max?: number; min?: number };
      height?: number | { ideal?: number; max?: number; min?: number };
      aspectRatio?: number;
    };
    audio?: boolean;
  }

  interface QrScannerProps {
    onScan: (result: string | null) => void;
    onError: (error: Error) => void;
    constraints?: QrScannerConstraints;
    className?: string;
    style?: React.CSSProperties;
    videoStyle?: React.CSSProperties;
    delay?: number;
    onLoadStart?: () => void;
    onLoadEnd?: () => void;
  }

  const QrScanner: FC<QrScannerProps>;
  
  export default QrScanner;
}
