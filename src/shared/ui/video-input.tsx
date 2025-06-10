import { cn } from "../lib/utils";
import { Button } from "./button";
import { VideoPlayer } from "@/shared/components/VideoPlayer";

export type IVideoInputProps = {
  value: File | null;
  onChange: (file: File | null | undefined) => void;
  existingVideoUrl?: string;
  label?: string;
  accept?: string;
  className?: string;
};

export const VideoInput = ({
  value,
  onChange,
  existingVideoUrl,
  label = "видео",
  accept = "video/*",
  className,
}: IVideoInputProps) => {
  // Создаем источник для Vidstack согласно документации
  const videoSrc = value
    ? ({ src: value, type: "video/object" } as const)
    : existingVideoUrl;

  const videoKey = value
    ? `file-${value.name}-${value.size}-${value.lastModified}`
    : `url-${existingVideoUrl}`;

  return (
    <div className="space-y-4">
      <div
        className={cn(
          "border-muted-foreground/25 hover:border-muted-foreground/50 relative flex min-h-[150px] cursor-pointer items-center justify-center rounded-lg border-2 border-dashed p-6 text-center transition-colors",
          className,
        )}
        onClick={() => {
          const input = document.createElement("input");
          input.type = "file";
          input.accept = accept;
          input.onchange = (e) => {
            const file = (e.target as HTMLInputElement).files?.[0];
            if (file) {
              onChange(file);
            }
          };
          input.click();
        }}
      >
        {videoSrc ? (
          <div className="space-y-2">
            <div
              className="relative mx-auto w-full max-w-[500px] overflow-hidden rounded-lg"
              onClick={(e) => e.stopPropagation()}
            >
              <VideoPlayer
                title={value?.name || "Видео"}
                key={videoKey}
                src={videoSrc}
              />
            </div>
            <p className="text-muted-foreground text-sm">
              {value ? value.name : `Текущее ${label}`}
            </p>
            <p className="text-muted-foreground text-xs">Нажмите для замены</p>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="bg-muted mx-auto flex h-12 w-12 items-center justify-center rounded-lg">
              <svg
                className="text-muted-foreground h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h8m-4-8V4a1 1 0 011-1h2a1 1 0 011 1v2M7 7h10a2 2 0 012 2v8a2 2 0 01-2-2V9a2 2 0 012-2z"
                />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium">Нажмите для выбора {label}</p>
              <p className="text-muted-foreground text-xs">
                MP4, MOV, AVI до 50MB
              </p>
            </div>
          </div>
        )}
      </div>
      {(value || existingVideoUrl) && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => onChange(undefined)}
        >
          {existingVideoUrl && !value
            ? `Оставить без ${label}`
            : `Удалить ${label}`}
        </Button>
      )}
    </div>
  );
};
