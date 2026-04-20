import { useState } from 'react';

interface TokenInputProps {
  token: string;
  onTokenChange: (token: string) => void;
}

export function TokenInput({ token, onTokenChange }: TokenInputProps) {
  const [show, setShow] = useState(false);

  return (
    <div className="flex flex-col gap-2">
      <label className="font-semibold text-sm" htmlFor="pat-token">GitHub PAT Token</label>
      <div className="flex gap-2">
        <input
          id="pat-token"
          type={show ? 'text' : 'password'}
          value={token}
          onChange={e => onTokenChange(e.target.value)}
          placeholder="ghp_..."
          className="flex-1 border rounded px-3 py-2 text-sm font-mono dark:bg-gray-800 dark:border-gray-600 dark:text-white"
        />
        <button
          type="button"
          onClick={() => setShow(s => !s)}
          className="px-3 py-2 border rounded text-sm dark:border-gray-600 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          {show ? 'Hide' : 'Show'}
        </button>
      </div>
      <p className="text-xs text-amber-600 dark:text-amber-400">
        ⚠️ Token is stored in localStorage — for internal/team use only. Needs <code>repo</code> (read) scope.
      </p>
    </div>
  );
}
