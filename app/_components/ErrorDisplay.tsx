import React from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { XCircle } from 'lucide-react';

interface ErrorDisplayProps {
  error: Error;
}

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ error }) => {
  const refreshPage = () => {
    window.location.reload();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <Alert variant="destructive" className="w-96">
        <XCircle className="h-4 w-4" />
        <AlertTitle>약간의 문제가 발생했습니다</AlertTitle>
        <AlertDescription>
          {error.message}
          <Button onClick={refreshPage} variant="outline" className="mt-2 w-full">
            페이지 새로고침
          </Button>
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default ErrorDisplay;
