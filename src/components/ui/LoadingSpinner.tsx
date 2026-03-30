interface LoadingSpinnerProps {
  text?: string;
}

export default function LoadingSpinner({ text }: LoadingSpinnerProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-12">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-coral/30 border-t-coral" />
      {text && <p className="text-sm text-cocoa-light">{text}</p>}
    </div>
  );
}
