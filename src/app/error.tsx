"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-6 text-center px-4">
      <p className="text-5xl">🎬</p>
      <div className="flex flex-col gap-2">
        <h2 className="text-xl font-bold">Algo deu errado</h2>
        <p className="text-sm text-gray-500">
          Não foi possível carregar a página. Tente novamente.
        </p>
      </div>
      <button
        onClick={reset}
        className="px-5 py-2.5 bg-color-primary text-white text-sm font-semibold rounded-md hover:saturate-150 duration-300"
      >
        Tentar novamente
      </button>
    </div>
  );
}
