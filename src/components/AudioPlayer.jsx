import { useRef, useState, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX } from 'lucide-react';
import { Waveform } from './UIComponents';

function fmt(s) {
  if (!s || isNaN(s)) return '0:00';
  const m = Math.floor(s / 60);
  return `${m}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
}

export default function AudioPlayer({ audioFile, durationSeconds, title }) {
  const audioRef = useRef(null);
  const trackRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(durationSeconds || 0);
  const [volume, setVolume] = useState(0.8);
  const [muted, setMuted] = useState(false);
  const [hasRealAudio, setHasRealAudio] = useState(true);

  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    const onMeta  = () => {
      if (a.duration && !isNaN(a.duration)) setDuration(a.duration);
      setHasRealAudio(true);
    };
    const onTime  = () => setCurrent(a.currentTime);
    const onEnded = () => setPlaying(false);
    const onErr   = () => setHasRealAudio(false);
    a.addEventListener('loadedmetadata', onMeta);
    a.addEventListener('timeupdate', onTime);
    a.addEventListener('ended', onEnded);
    a.addEventListener('error', onErr);
    return () => {
      a.removeEventListener('loadedmetadata', onMeta);
      a.removeEventListener('timeupdate', onTime);
      a.removeEventListener('ended', onEnded);
      a.removeEventListener('error', onErr);
    };
  }, [durationSeconds]);

  // Simulated fallback tick if audio fails to load
  useEffect(() => {
    if (!playing || hasRealAudio) return;
    const id = setInterval(() => {
      setCurrent(t => {
        if (t + 1 >= duration) { setPlaying(false); return 0; }
        return t + 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [playing, hasRealAudio, duration]);

  const toggle = () => {
    const a = audioRef.current;
    if (hasRealAudio && a) {
      if (playing) {
        a.pause();
      } else {
        a.play().catch(() => setHasRealAudio(false));
      }
    }
    setPlaying(p => !p);
  };

  const seek = (e) => {
    if (!trackRef.current) return;
    const rect = trackRef.current.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const t = ratio * duration;
    setCurrent(t);
    if (audioRef.current && hasRealAudio) audioRef.current.currentTime = t;
  };

  const skip = (d) => {
    const t = Math.max(0, Math.min(current + d, duration));
    setCurrent(t);
    if (audioRef.current && hasRealAudio) audioRef.current.currentTime = t;
  };

  const onVolume = (e) => {
    const v = parseFloat(e.target.value);
    setVolume(v);
    if (audioRef.current) audioRef.current.volume = v;
    setMuted(v === 0);
  };

  const toggleMute = () => {
    const next = !muted;
    setMuted(next);
    if (audioRef.current) audioRef.current.muted = next;
  };

  const onTrackKeyDown = (e) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      skip(5);
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      skip(-5);
    } else if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      toggle();
    }
  };

  const pct = duration > 0 ? (current / duration) * 100 : 0;

  return (
    <div className="player">
      <audio ref={audioRef} src={audioFile} preload="metadata" />

      <div className="player-header">
        <div>
          <div className="player-title">{title}</div>
          {!hasRealAudio && (
            <div className="player-warn">
              <span aria-hidden="true">⚠</span> Simulated playback mode
            </div>
          )}
        </div>
        <Waveform playing={playing} />
      </div>

      {/* Accessible Interactive Timeline */}
      <div className="player-timeline">
        <div
          ref={trackRef}
          className="timeline-track"
          onClick={seek}
          onKeyDown={onTrackKeyDown}
          role="slider"
          aria-valuenow={Math.round(current)}
          aria-valuemin={0}
          aria-valuemax={Math.round(duration)}
          aria-valuetext={`${fmt(current)} of ${fmt(duration)}`}
          aria-label="Audio playback position"
          tabIndex={0}
        >
          <div className="timeline-fill" style={{ width: `${pct}%` }} />
          <div className="timeline-thumb" style={{ left: `${pct}%` }} />
        </div>
        <div className="timeline-times">
          <span>{fmt(current)}</span>
          <span>{fmt(duration)}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="player-controls">
        <button className="skip-btn" onClick={() => skip(-10)} aria-label="Rewind 10 seconds">
          <SkipBack size={13} strokeWidth={2} aria-hidden="true" />
        </button>

        <button
          className="play-btn"
          onClick={toggle}
          id={`play-${title?.replace(/\W+/g, '-')}`}
          aria-label={playing ? 'Pause audio' : 'Play audio'}
        >
          {playing
            ? <Pause size={16} strokeWidth={2.5} aria-hidden="true" />
            : <Play size={16} strokeWidth={2.5} style={{ marginLeft: 2 }} aria-hidden="true" />
          }
        </button>

        <button className="skip-btn" onClick={() => skip(10)} aria-label="Forward 10 seconds">
          <SkipForward size={13} strokeWidth={2} aria-hidden="true" />
        </button>

        <div className="vol-group">
          <button className="skip-btn" onClick={toggleMute} aria-label={muted ? 'Unmute volume' : 'Mute volume'}>
            {muted || volume === 0
              ? <VolumeX size={13} strokeWidth={2} aria-hidden="true" />
              : <Volume2 size={13} strokeWidth={2} aria-hidden="true" />
            }
          </button>
          <input
            type="range"
            className="vol-slider"
            min={0}
            max={1}
            step={0.05}
            value={muted ? 0 : volume}
            onChange={onVolume}
            aria-label="Volume level"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round((muted ? 0 : volume) * 100)}
          />
        </div>
      </div>
    </div>
  );
}
