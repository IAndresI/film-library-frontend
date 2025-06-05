import { Button } from "./button";

export type IImageInputProps = {
  value: File | null;
  onChange: (file: File | null | undefined) => void;
  existingImageUrl?: string;
};

export const ImageInput = ({
  value,
  onChange,
  existingImageUrl,
}: IImageInputProps) => {
  return (
    <div className="space-y-4">
      <div
        className="border-muted-foreground/25 hover:border-muted-foreground/50 relative min-h-[150px] cursor-pointer rounded-lg border-2 border-dashed p-6 text-center transition-colors"
        onClick={() => {
          const input = document.createElement("input");
          input.type = "file";
          input.accept = "image/*";
          input.onchange = (e) => {
            const file = (e.target as HTMLInputElement).files?.[0];
            if (file) {
              onChange(file);
            }
          };
          input.click();
        }}
      >
        {value ? (
          <div className="space-y-2">
            <img
              src={URL.createObjectURL(value)}
              alt="Preview"
              className="mx-auto h-32 w-32 rounded-lg object-cover"
            />
            <p className="text-muted-foreground text-sm">{value.name}</p>
            <p className="text-muted-foreground text-xs">Нажмите для замены</p>
          </div>
        ) : existingImageUrl ? (
          <div className="space-y-2">
            <img
              src={existingImageUrl}
              alt="Текущее изображение"
              className="mx-auto h-32 w-32 rounded-lg object-cover"
            />
            <p className="text-muted-foreground text-sm">Текущее изображение</p>
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
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium">
                Нажмите для выбора изображения
              </p>
              <p className="text-muted-foreground text-xs">
                PNG, JPG, GIF до 5MB
              </p>
            </div>
          </div>
        )}
      </div>
      {(value || existingImageUrl) && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => onChange(undefined)}
        >
          {existingImageUrl && !value
            ? "Оставить без изображения"
            : "Удалить изображение"}
        </Button>
      )}
    </div>
  );
};
