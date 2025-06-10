import "@vidstack/react/player/styles/base.css";
import {
  MediaPlayer,
  MediaProvider,
  Time,
  TimeSlider,
  PlayButton,
  VolumeSlider,
  MuteButton,
  useMediaState,
  Menu,
  FullscreenButton,
  useMediaRemote,
  PIPButton,
  type PlayerSrc,
} from "@vidstack/react";
import {
  FullscreenExitIcon,
  FullscreenIcon,
  PauseIcon,
  PlayIcon,
  SettingsIcon,
  PictureInPictureIcon,
  PictureInPictureExitIcon,
  ReplayIcon,
} from "@vidstack/react/icons";
import { Volume, Volume1, Volume2, VolumeX } from "lucide-react";
import { useState, useRef, useCallback } from "react";
import { cn } from "../lib/utils";
import { SvgSpinner } from "../ui/svg/SvgSpinner";

export const VideoPlayer = ({
  src,
  title,
}: {
  src: PlayerSrc;
  title: string;
}) => {
  return (
    <MediaPlayer
      streamType="on-demand"
      title={title}
      src={src}
      storage="vidstack-player"
    >
      <MediaProvider />
      <VideoControls />
    </MediaPlayer>
  );
};

let clickTimeout: NodeJS.Timeout | null = null;

const VideoControls = () => {
  const volume = useMediaState("volume");
  const muted = useMediaState("muted");
  const playbackRate = useMediaState("playbackRate");
  const paused = useMediaState("paused");
  const fullscreen = useMediaState("fullscreen");
  const remote = useMediaRemote();

  const [showControls, setShowControls] = useState(true);
  const hideTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const speedOptions = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];

  const showControlsHandler = useCallback(() => {
    setShowControls(true);

    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
    }

    if (!paused) {
      hideTimeoutRef.current = setTimeout(() => {
        setShowControls(false);
      }, 3000);
    }
  }, [paused]);

  const hideControlsHandler = useCallback(() => {
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
    }
    if (!paused) {
      setShowControls(false);
    }
  }, [paused]);

  const shouldShowControls = showControls || paused;

  const getVolumeIcon = () => {
    if (muted || volume === 0) {
      return <VolumeX className="h-4 w-4" />;
    } else if (volume < 0.3) {
      return <Volume className="h-4 w-4" />;
    } else if (volume < 0.7) {
      return <Volume1 className="h-4 w-4" />;
    } else {
      return <Volume2 className="h-4 w-4" />;
    }
  };

  const handleSpeedChange = (speed: number) => {
    remote.changePlaybackRate(speed);
  };

  const handlePlayPause = () => {
    if (paused) {
      remote.play();
      setShowControls(false);
    } else {
      remote.pause();
    }
  };

  const handleFullscreenToggle = () => {
    if (fullscreen) {
      remote.exitFullscreen();
    } else {
      remote.enterFullscreen();
    }
  };

  const handleSingleClick = () => {
    if (clickTimeout) {
      clearTimeout(clickTimeout);
      clickTimeout = null;
      return;
    }

    clickTimeout = setTimeout(() => {
      handlePlayPause();
      clickTimeout = null;
    }, 200);
  };

  const handleDoubleClick = () => {
    if (clickTimeout) {
      clearTimeout(clickTimeout);
      clickTimeout = null;
    }
    handleFullscreenToggle();
  };

  return (
    <div
      className={cn(
        `absolute inset-0`,
        shouldShowControls
          ? "cursor-auto opacity-100"
          : "cursor-none opacity-0",
      )}
      onMouseMove={showControlsHandler}
      onMouseEnter={showControlsHandler}
      onMouseLeave={hideControlsHandler}
    >
      <div className="media-waiting:flex absolute inset-0 bottom-[68px] hidden items-center justify-center">
        <SvgSpinner className="size-40" />
      </div>

      {/* Клик по видео для воспроизведения/паузы */}
      <button
        type="button"
        className={cn(
          `group absolute inset-0 bottom-[68px] flex items-center justify-center`,
          shouldShowControls ? "cursor-auto" : "cursor-none",
        )}
        onClick={handleSingleClick}
        onDoubleClick={handleDoubleClick}
      >
        <PlayIcon
          className={`media-waiting:hidden media-playing:hidden media-ended:hidden h-20 w-20 cursor-pointer rounded-md ring-sky-400 transition duration-300 outline-none ring-inset group-hover:bg-white/20 hover:scale-110 data-[focus]:ring-4`}
        />
        <ReplayIcon className="media-waiting:hidden media-ended:block hidden h-20 w-20 cursor-pointer rounded-md ring-sky-400 transition duration-300 outline-none ring-inset group-hover:bg-white/20 hover:scale-110 data-[focus]:ring-4" />
      </button>
      {/* Слайдер прогресса видео */}
      <div
        className={`absolute right-4 bottom-14 left-4 transition-opacity duration-300`}
      >
        <TimeSlider.Root className="group relative flex h-4 w-full cursor-pointer touch-none items-center py-1 select-none">
          <TimeSlider.Track className="relative z-0 h-1.5 w-full rounded-sm border border-black bg-white/30 ring-sky-400 transition group-hover:scale-y-[1.7] group-data-[focus]:ring-[3px]">
            <TimeSlider.TrackFill className="absolute h-full w-[var(--slider-fill)] rounded-sm bg-white will-change-[width]" />
            <TimeSlider.Progress className="absolute z-10 h-full w-[var(--chapter-progress)] rounded-sm bg-white/50 will-change-[width]" />
          </TimeSlider.Track>
          <TimeSlider.Preview
            className="pointer-events-none flex flex-col items-center opacity-0 transition-opacity duration-200 data-[visible]:opacity-100"
            noClamp
          >
            <TimeSlider.ChapterTitle className="text-sm" />
            <TimeSlider.Value className="rounded-sm bg-black px-2 py-px text-[13px] font-medium text-white" />
          </TimeSlider.Preview>
          <TimeSlider.Thumb className="absolute top-1/2 left-[var(--slider-fill)] z-20 h-[15px] w-[15px] -translate-x-1/2 -translate-y-1/2 scale-75 rounded-full border border-black bg-white ring-white/40 transition-opacity will-change-[left] group-data-[active]:scale-100 group-data-[dragging]:ring-4" />
        </TimeSlider.Root>
      </div>

      {/* Элементы управления */}
      <div
        className={`absolute right-0 bottom-0 left-0 bg-gradient-to-t from-black/80 to-transparent p-4 pt-0 transition-opacity duration-300`}
      >
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <PlayButton className="flex h-8 w-8 flex-shrink-0 cursor-pointer items-center justify-center rounded-full bg-white/20 transition-colors hover:bg-white/30">
              <PlayIcon className="media-paused:block hidden h-6 w-6" />
              <PauseIcon className="media-playing:block hidden h-6 w-6" />
              <SvgSpinner className="media-waiting:block hidden size-6" />
            </PlayButton>

            <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-1">
              <Time
                className="time flex-shrink-0 text-sm text-white"
                type="current"
              />
              <span className="text-sm text-white">/</span>
              <Time
                className="time flex-shrink-0 text-sm text-white"
                type="duration"
              />
            </div>
          </div>

          {/* Регулировка звука и настройки */}
          <div className="flex flex-shrink-0 items-center gap-2">
            <MuteButton className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-white/20 transition-colors hover:bg-white/30">
              {getVolumeIcon()}
            </MuteButton>

            <VolumeSlider.Root className="group relative flex h-4 w-20 cursor-pointer touch-none items-center py-1 select-none">
              <VolumeSlider.Track className="relative h-1.5 w-full rounded-full bg-white/20">
                <VolumeSlider.TrackFill className="absolute h-full w-[var(--slider-fill)] rounded-sm bg-white will-change-[width]" />
              </VolumeSlider.Track>
              <VolumeSlider.Preview
                className="pointer-events-none flex flex-col items-center opacity-0 transition-opacity duration-200 data-[visible]:opacity-100"
                noClamp
              >
                <VolumeSlider.Value className="rounded-sm bg-black px-2 py-px text-[13px] font-medium text-white" />
              </VolumeSlider.Preview>
              <VolumeSlider.Thumb className="absolute top-1/2 left-[var(--slider-fill)] z-20 block h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#cacaca] bg-white opacity-0 shadow-lg ring-white/40 transition will-change-[left] group-data-[active]:opacity-100 group-data-[dragging]:ring-4 group-data-[hocus]:scale-110 focus:ring-4 focus:ring-white/50 focus:outline-none" />
            </VolumeSlider.Root>

            {/* Меню настроек */}
            <Menu.Root>
              <Menu.Button className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-white/20 transition-colors hover:bg-white/30">
                <SettingsIcon className="h-6 w-6 text-white" />
              </Menu.Button>
              <Menu.Content className="absolute right-0 bottom-full z-50 mb-2 min-w-[160px] rounded-lg border border-white/10 bg-black/90 p-2 shadow-xl backdrop-blur-sm">
                <Menu.Root>
                  <Menu.Button className="flex w-full items-center justify-between rounded px-3 py-2 text-sm text-white transition-colors hover:bg-white/10">
                    <span>Скорость</span>
                    <span className="text-xs text-white/70">
                      {playbackRate}x
                    </span>
                  </Menu.Button>
                  <Menu.Content className="absolute right-full bottom-0 mr-1 min-w-[100px] rounded-lg border border-white/10 bg-black/90 p-1 shadow-xl backdrop-blur-sm">
                    {speedOptions.map((speed) => (
                      <button
                        type="button"
                        key={speed}
                        onClick={() => handleSpeedChange(speed)}
                        className={`w-full cursor-pointer rounded px-3 py-2 text-left text-sm transition-colors hover:bg-white/10 ${
                          playbackRate === speed
                            ? "bg-white/5 text-blue-400"
                            : "text-white"
                        }`}
                      >
                        {speed}x
                      </button>
                    ))}
                  </Menu.Content>
                </Menu.Root>
              </Menu.Content>
            </Menu.Root>

            {/* Picture-in-Picture режим */}
            <PIPButton className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-white/20 transition-colors hover:bg-white/30">
              <PictureInPictureIcon className="media-pip:hidden h-6 w-6 text-white" />
              <PictureInPictureExitIcon className="media-pip:block hidden h-6 w-6 text-white" />
            </PIPButton>

            {/* Полноэкранный режим */}
            <FullscreenButton className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-white/20 transition-colors hover:bg-white/30">
              <FullscreenIcon className="media-fullscreen:hidden h-6 w-6 text-white" />
              <FullscreenExitIcon className="media-fullscreen:block hidden h-6 w-6 text-white" />
            </FullscreenButton>
          </div>
        </div>
      </div>
    </div>
  );
};
