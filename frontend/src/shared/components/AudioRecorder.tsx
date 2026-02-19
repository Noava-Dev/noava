import { useState, useRef, useEffect } from 'react';
import { Button, Progress } from 'flowbite-react';
import { HiMicrophone, HiStop, HiPlay, HiTrash } from 'react-icons/hi';
import { useTranslation } from 'react-i18next';

interface AudioRecorderProps {
  onRecordingComplete: (audioBlob: Blob) => void;
  onRecordingDelete: () => void;
  maxDuration?: number; // in seconds
}

export const AudioRecorder = ({
  onRecordingComplete,
  onRecordingDelete,
  maxDuration = 15,
}: AudioRecorderProps) => {
  const { t } = useTranslation('flashcards');
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    return () => {

      if (timerRef.current) clearInterval(timerRef.current);
      if (audioUrl) URL.revokeObjectURL(audioUrl);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const startRecording = async () => {
    try {
      setError(null);
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm',
      });

      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });

        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);
        onRecordingComplete(audioBlob);

        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);


      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => {
          const newTime = prev + 1;
          if (newTime >= maxDuration) {
            stopRecording();
          }
          return newTime;
        });
      }, 1000);
    } catch (err) {
      console.error('Error starting recording:', err);
      setError(t('audioRecorder.permissionDenied'));
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  };

  const playRecording = () => {
    if (audioUrl) {
      if (audioRef.current) {
        audioRef.current.pause();
      }

      const audio = new Audio(audioUrl);
      audioRef.current = audio;

      audio.onended = () => {
        setIsPlaying(false);
        audioRef.current = null;
      };

      audio.play();
      setIsPlaying(true);
    }
  };

  const deleteRecording = () => {
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
    }
    setAudioUrl(null);
    setRecordingTime(0);
    audioChunksRef.current = [];
    onRecordingDelete();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = (recordingTime / maxDuration) * 100;

  return (
    <div className="p-4 border-2 border-dashed rounded-lg border-gray-300 dark:border-gray-600">
      {error && (
        <div className="p-2 mb-3 text-sm text-red-700 rounded bg-red-50 dark:bg-red-900/20 dark:text-red-400">
          {error}
        </div>
      )}

      {!audioUrl && !isRecording && (
        <div className="flex flex-col items-center gap-3">
          <Button
            onClick={startRecording}
            className="bg-red-500 hover:bg-red-600">
            <HiMicrophone className="w-5 h-5 mr-2" />
            {t('audioRecorder.startRecording')}
          </Button>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {t('audioRecorder.maxDuration', { seconds: maxDuration })}
          </p>
        </div>
      )}

      {isRecording && (
        <div className="space-y-3">
          <div className="flex items-center justify-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
              <span className="text-lg font-mono text-gray-900 dark:text-white">
                {formatTime(recordingTime)}
              </span>
              <span className="text-sm text-gray-500">
                / {formatTime(maxDuration)}
              </span>
            </div>
          </div>

          <Progress 
            progress={progress} 
            color={progress > 80 ? 'red' : 'blue'} 
            size="sm" 
          />

          <div className="flex justify-center">
            <Button
              onClick={stopRecording}
              color="failure">
              <HiStop className="w-5 h-5 mr-2" />
              {t('audioRecorder.stopRecording')}
            </Button>
          </div>
        </div>
      )}

      {audioUrl && !isRecording && (
        <div className="space-y-3">
          <div className="flex items-center justify-center gap-2 p-3 rounded-lg bg-green-50 dark:bg-green-900/20">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm font-medium text-green-700 dark:text-green-400">
                {t('audioRecorder.recordingComplete')}
              </span>
            </div>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              ({formatTime(recordingTime)})
            </span>
          </div>

          <div className="flex justify-center gap-2">
            <Button
              size="sm"
              color="gray"
              onClick={playRecording}
              disabled={isPlaying}>
              <HiPlay className="w-4 h-4 mr-1" />
              {isPlaying ? t('audioRecorder.playing') : t('audioRecorder.play')}
            </Button>
            <Button
              size="sm"
              color="failure"
              onClick={deleteRecording}>
              <HiTrash className="w-4 h-4 mr-1" />
              {t('audioRecorder.delete')}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};