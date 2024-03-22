interface progressBarProps {
  progress: number;
}

export function ProgressBar({ progress }: progressBarProps) {
  const progressStyles = {
    width: `${progress}%`,
  };

  return (
    <div className="h-3 rounded-xl bg-zinc-700 w-full mt-4">
      <div
        role="progressbar"
        aria-label="progresso do haitos completados nesse dia"
        aria-valuenow={progress}
        className="h-3 rounded-xl bg-violet-600 transition-all"
        style={progressStyles}
      ></div>
    </div>
  );
}
