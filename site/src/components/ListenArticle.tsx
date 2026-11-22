"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/*
 * « Écouter l'article ».
 * - With an ElevenLabs recording (public/audio/<slug>.mp3 + .json), plays it and
 *   highlights the paragraph being read using the start time of each block.
 * - Without one, falls back to the browser's speech synthesis, cut into short
 *   chunks because Chrome stops long utterances.
 */

export type ArticleAudio = { src: string; duration: number; starts: number[]; words?: number[][] };
type State = "idle" | "playing" | "paused";

const RATES = [1, 1.25, 1.5];
const CHARS_PER_MINUTE = 900; // average French speech at rate 1

function formatMinutes(min: number) {
  const m = Math.max(1, Math.round(min));
  return m >= 60 ? `${Math.floor(m / 60)} h ${String(m % 60).padStart(2, "0")}` : `${m} min`;
}

function articleBlocks(targetId: string): HTMLElement[] {
  const root = document.getElementById(targetId);
  if (!root) return [];
  return Array.from(root.children).filter(
    (el): el is HTMLElement => el instanceof HTMLElement && el.tagName !== "HR" && !!el.textContent?.trim(),
  );
}

function highlight(blocks: HTMLElement[], block: number, follow: boolean) {
  blocks.forEach((el, i) => el.classList.toggle("is-speaking", i === block));
  const el = blocks[block];
  if (el && follow) {
    const r = el.getBoundingClientRect();
    if (r.top < 80 || r.bottom > window.innerHeight - 40) el.scrollIntoView({ behavior: "smooth", block: "center" });
  }
}

const TEXT = {
  fr: {
    listen: "Écouter l’article",
    listenAria: "Écouter l'article",
    pauseAria: "Mettre la lecture en pause",
    pause: "Pause",
    resume: "Reprendre",
    left: (m: string) => `encore ${m}`,
    speedAria: "Changer la vitesse de lecture",
    stop: "Arrêter",
    decimal: ",",
  },
  en: {
    listen: "Listen to the article",
    listenAria: "Listen to the article",
    pauseAria: "Pause the reading",
    pause: "Pause",
    resume: "Resume",
    left: (m: string) => `${m} left`,
    speedAria: "Change the playback speed",
    stop: "Stop",
    decimal: ".",
  },
};
type ListenLang = keyof typeof TEXT;

function Player(props: {
  lang: ListenLang;
  state: State;
  rate: number;
  minutesTotal: number;
  minutesLeft: number;
  progress: number;
  onToggle: () => void;
  onRate: () => void;
  onStop: () => void;
  onSeek?: (ratio: number) => void;
}) {
  const { state, rate } = props;
  const t = TEXT[props.lang];
  return (
    <div className="mt-8 flex flex-wrap items-center gap-3">
      <button
        type="button"
        onClick={props.onToggle}
        className="group inline-flex items-center gap-3 rounded-full bg-ink py-2.5 pl-3 pr-5 text-bone transition hover:bg-morpho"
        aria-label={state === "playing" ? t.pauseAria : t.listenAria}
      >
        <span className="grid size-7 place-items-center rounded-full bg-bone/15">
          {state === "playing" ? (
            <svg viewBox="0 0 16 16" className="size-3.5 fill-current"><rect x="3" y="2" width="3.5" height="12" rx="1" /><rect x="9.5" y="2" width="3.5" height="12" rx="1" /></svg>
          ) : (
            <svg viewBox="0 0 16 16" className="ml-0.5 size-3.5 fill-current"><path d="M4 2.5v11a.5.5 0 0 0 .76.43l9-5.5a.5.5 0 0 0 0-.86l-9-5.5A.5.5 0 0 0 4 2.5Z" /></svg>
          )}
        </span>
        <span className="font-mono text-xs uppercase tracking-[0.18em]">
          {state === "idle" && <>{t.listen} · {formatMinutes(props.minutesTotal)}</>}
          {state === "playing" && <>{t.pause} · {t.left(formatMinutes(props.minutesLeft))}</>}
          {state === "paused" && <>{t.resume} · {t.left(formatMinutes(props.minutesLeft))}</>}
        </span>
      </button>

      <button
        type="button"
        onClick={props.onRate}
        className="rounded-full border border-line px-3 py-2 font-mono text-xs tracking-[0.1em] transition hover:border-morpho hover:text-morpho"
        aria-label={t.speedAria}
      >
        {String(rate).replace(".", t.decimal)}×
      </button>

      {state !== "idle" && (
        <button
          type="button"
          onClick={props.onStop}
          className="rounded-full border border-line px-3 py-2 font-mono text-xs uppercase tracking-[0.15em] transition hover:border-morpho hover:text-morpho"
        >
          {t.stop}
        </button>
      )}

      {state !== "idle" && (
        <div
          className={`group/bar w-full py-2 ${props.onSeek ? "cursor-pointer" : ""}`}
          onClick={(e) => {
            if (!props.onSeek) return;
            const r = e.currentTarget.getBoundingClientRect();
            props.onSeek((e.clientX - r.left) / r.width);
          }}
          aria-hidden
        >
          <div className="h-[3px] overflow-hidden rounded-full bg-line transition-[height] group-hover/bar:h-[5px]">
            <div className="h-full bg-morpho transition-[width] duration-300" style={{ width: `${props.progress * 100}%` }} />
          </div>
        </div>
      )}
    </div>
  );
}

/* Wraps every word of the article blocks in a span, keeping inline formatting. */
type Word = { el: HTMLSpanElement; t: number };

function wrapWords(blocks: HTMLElement[], times: number[][] | undefined, starts: number[]): Word[] {
  const out: Word[] = [];
  blocks.forEach((block, b) => {
    let spans = Array.from(block.querySelectorAll<HTMLSpanElement>("span.w"));
    if (spans.length === 0) {
      const walker = document.createTreeWalker(block, NodeFilter.SHOW_TEXT);
      const nodes: Text[] = [];
      while (walker.nextNode()) nodes.push(walker.currentNode as Text);
      let afterSpace = true;
      for (const node of nodes) {
        if (node.previousSibling?.nodeName === "BR") afterSpace = true;
        const frag = document.createDocumentFragment();
        for (const part of node.data.split(/(\s+)/)) {
          if (!part) continue;
          if (/^\s+$/.test(part)) {
            frag.append(part);
            afterSpace = true;
          } else {
            const span = document.createElement("span");
            span.className = "w";
            // Stuck to the previous word across a tag (« école</em>, ») : same word for the audio.
            if (!afterSpace) span.dataset.glued = "1";
            span.textContent = part;
            frag.append(span);
            afterSpace = false;
          }
        }
        node.replaceWith(frag);
      }
      spans = Array.from(block.querySelectorAll<HTMLSpanElement>("span.w"));
    }
    const t = times?.[b] ?? [];
    const next = starts[b + 1] ?? starts[b] + 30;
    const count = spans.filter((sp) => !sp.dataset.glued).length;
    let k = -1;
    spans.forEach((el) => {
      if (!el.dataset.glued || k < 0) k++;
      // Same word count as the recording; otherwise spread proportionally.
      const time = t.length
        ? t[t.length === count ? k : Math.min(t.length - 1, Math.floor((k * t.length) / count))]
        : starts[b] + ((next - starts[b]) * k) / count;
      out.push({ el, t: time });
    });
  });
  return out;
}

/* ElevenLabs recording, with the text appearing word by word as it is read. */
function AudioListen({ audio, targetId, lang }: { audio: ArticleAudio; targetId: string; lang: ListenLang }) {
  const el = useRef<HTMLAudioElement | null>(null);
  const blocks = useRef<HTMLElement[]>([]);
  const words = useRef<Word[]>([]);
  const shown = useRef(0); // number of words already revealed
  const lastBlock = useRef(-2);
  const userScrolledAt = useRef(0);
  const lastLineTop = useRef(-1);
  const [state, setState] = useState<State>("idle");
  const [rate, setRate] = useState(1);
  const [time, setTime] = useState(0);

  const root = () => document.getElementById(targetId);

  // Reveals (or hides again after a backward seek) the words up to the current time.
  const sync = useCallback((now: number, follow: boolean) => {
    const list = words.current;
    let n = shown.current;
    while (n < list.length && list[n].t <= now + 0.05) list[n++].el.classList.add("is-read");
    while (n > 0 && list[n - 1].t > now + 0.05) list[--n].el.classList.remove("is-read");
    if (n !== shown.current) {
      list[shown.current - 1]?.el.classList.remove("is-now");
      list[n - 1]?.el.classList.add("is-now");
      shown.current = n;
      // Follow the reading line by line: each new line is brought to 40 % of the screen.
      const cur = list[n - 1]?.el;
      if (cur && follow && Date.now() - userScrolledAt.current > 4000) {
        const r = cur.getBoundingClientRect();
        const lineTop = r.top + window.scrollY;
        if (Math.abs(lineTop - lastLineTop.current) > 4) {
          lastLineTop.current = lineTop;
          const offset = r.top - window.innerHeight * 0.4;
          if (Math.abs(offset) > 8) window.scrollBy({ top: offset, behavior: "smooth" });
        }
      }
    }
    let b = -1;
    while (b + 1 < audio.starts.length && audio.starts[b + 1] <= now + 0.15) b++;
    if (b !== lastBlock.current) {
      lastBlock.current = b;
      highlight(blocks.current, b, false);
    }
  }, [audio.starts]);

  const reset = useCallback(() => {
    root()?.classList.remove("is-streaming");
    words.current.forEach((w) => w.el.classList.remove("is-read", "is-now"));
    shown.current = 0;
    highlight(blocks.current, -1, false);
    lastBlock.current = -2;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    blocks.current = articleBlocks(targetId);
    const a = new Audio(audio.src);
    a.preload = "none";
    el.current = a;
    let raf = 0;
    const loop = () => {
      sync(a.currentTime, true);
      raf = requestAnimationFrame(loop);
    };
    const onPlay = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(loop);
    };
    const onPause = () => cancelAnimationFrame(raf);
    const onTime = () => setTime(a.currentTime);
    const onEnd = () => {
      setState("idle");
      setTime(0);
      reset();
    };
    const onUserScroll = () => (userScrolledAt.current = Date.now());
    a.addEventListener("play", onPlay);
    a.addEventListener("pause", onPause);
    a.addEventListener("timeupdate", onTime);
    a.addEventListener("ended", onEnd);
    window.addEventListener("wheel", onUserScroll, { passive: true });
    window.addEventListener("touchmove", onUserScroll, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      a.pause();
      a.removeEventListener("play", onPlay);
      a.removeEventListener("pause", onPause);
      a.removeEventListener("timeupdate", onTime);
      a.removeEventListener("ended", onEnd);
      window.removeEventListener("wheel", onUserScroll);
      window.removeEventListener("touchmove", onUserScroll);
      reset();
    };
  }, [audio, targetId, sync, reset]);

  const a = () => el.current!;
  const toggle = () => {
    if (state === "playing") {
      a().pause();
      setState("paused");
      return;
    }
    if (state === "idle") {
      if (words.current.length === 0) words.current = wrapWords(blocks.current, audio.words, audio.starts);
      root()?.classList.add("is-streaming");
      sync(a().currentTime, false);
      blocks.current[0]?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
    a().playbackRate = rate;
    void a().play();
    setState("playing");
  };
  const stop = () => {
    a().pause();
    a().currentTime = 0;
    setTime(0);
    setState("idle");
    reset();
  };
  const cycleRate = () => {
    const next = RATES[(RATES.indexOf(rate) + 1) % RATES.length];
    setRate(next);
    a().playbackRate = next;
  };
  const seek = (ratio: number) => {
    a().currentTime = Math.max(0, Math.min(1, ratio)) * audio.duration;
    setTime(a().currentTime);
    userScrolledAt.current = 0;
    sync(a().currentTime, true);
  };

  return (
    <Player
      lang={lang}
      state={state}
      rate={rate}
      minutesTotal={audio.duration / 60 / rate}
      minutesLeft={(audio.duration - time) / 60 / rate}
      progress={time / audio.duration}
      onToggle={toggle}
      onRate={cycleRate}
      onStop={stop}
      onSeek={seek}
    />
  );
}

/* Browser speech synthesis fallback. */
type Chunk = { text: string; block: number; chars: number };

function pickVoice(voices: SpeechSynthesisVoice[], lang: ListenLang) {
  const fr = voices.filter((v) => v.lang.toLowerCase().startsWith(lang));
  const score = (v: SpeechSynthesisVoice) => {
    let s = 0;
    if (/natural|premium|enhanced|neural/i.test(v.name)) s += 4;
    if (/google/i.test(v.name)) s += 3;
    if (/thomas|amélie|amelie|audrey|denise|henri|marie|samantha|daniel|aria|jenny|guy|ava|andrew/i.test(v.name)) s += 2;
    if (["fr-fr", "en-us", "en-gb"].includes(v.lang.toLowerCase())) s += 1;
    return s;
  };
  return fr.sort((a, b) => score(b) - score(a))[0] ?? null;
}

function splitSentences(text: string, max = 220): string[] {
  const sentences = text.match(/[^.!?…»]+[.!?…»]*\s*/g) ?? [text];
  const out: string[] = [];
  let cur = "";
  for (const s of sentences) {
    if ((cur + s).length > max && cur) {
      out.push(cur.trim());
      cur = "";
    }
    cur += s;
  }
  if (cur.trim()) out.push(cur.trim());
  return out;
}

function SpeechListen({ title, targetId, lang }: { title: string; targetId: string; lang: ListenLang }) {
  const [supported, setSupported] = useState(false);
  const [state, setState] = useState<State>("idle");
  const [rate, setRate] = useState(1);
  const [index, setIndex] = useState(0);
  const [chunks, setChunks] = useState<Chunk[]>([]);
  const blocks = useRef<HTMLElement[]>([]);
  const voice = useRef<SpeechSynthesisVoice | null>(null);
  const playing = useRef(false);
  const current = useRef(0);
  const rateRef = useRef(1);

  useEffect(() => {
    if (!("speechSynthesis" in window)) return;
    setSupported(true);
    const els = articleBlocks(targetId);
    blocks.current = els;
    const list: Chunk[] = splitSentences(title + ".").map((t) => ({ text: t, block: -1, chars: t.length }));
    els.forEach((el, i) => {
      for (const t of splitSentences(el.textContent!.replace(/\s+/g, " ").trim())) list.push({ text: t, block: i, chars: t.length });
    });
    setChunks(list);

    const loadVoice = () => (voice.current = pickVoice(speechSynthesis.getVoices(), lang));
    loadVoice();
    speechSynthesis.addEventListener("voiceschanged", loadVoice);
    return () => {
      speechSynthesis.removeEventListener("voiceschanged", loadVoice);
      playing.current = false;
      speechSynthesis.cancel();
    };
  }, [targetId, title, lang]);

  const speakFrom = useCallback(
    (i: number) => {
      speechSynthesis.cancel();
      if (i >= chunks.length) {
        playing.current = false;
        current.current = 0;
        setIndex(0);
        setState("idle");
        highlight(blocks.current, -1, false);
        return;
      }
      current.current = i;
      setIndex(i);
      highlight(blocks.current, chunks[i].block, true);
      const u = new SpeechSynthesisUtterance(chunks[i].text);
      u.lang = lang === "fr" ? "fr-FR" : "en-US";
      if (voice.current) u.voice = voice.current;
      u.rate = rateRef.current;
      u.onend = () => {
        if (playing.current && current.current === i) speakFrom(i + 1);
      };
      speechSynthesis.speak(u);
    },
    [chunks],
  );

  if (!supported || chunks.length === 0) return null;

  const total = chunks.reduce((s, c) => s + c.chars, 0);
  const done = chunks.slice(0, index).reduce((s, c) => s + c.chars, 0);

  return (
    <Player
      lang={lang}
      state={state}
      rate={rate}
      minutesTotal={total / CHARS_PER_MINUTE / rate}
      minutesLeft={(total - done) / CHARS_PER_MINUTE / rate}
      progress={state === "idle" ? 0 : done / total}
      onToggle={() => {
        if (state === "playing") {
          playing.current = false;
          speechSynthesis.cancel();
          setState("paused");
        } else {
          playing.current = true;
          setState("playing");
          speakFrom(current.current);
        }
      }}
      onRate={() => {
        const next = RATES[(RATES.indexOf(rate) + 1) % RATES.length];
        rateRef.current = next;
        setRate(next);
        if (playing.current) speakFrom(current.current);
      }}
      onStop={() => {
        playing.current = false;
        speechSynthesis.cancel();
        current.current = 0;
        setIndex(0);
        setState("idle");
        highlight(blocks.current, -1, false);
      }}
    />
  );
}

export default function ListenArticle({
  title,
  targetId,
  audio,
  lang = "fr",
}: {
  title: string;
  targetId: string;
  audio?: ArticleAudio | null;
  lang?: ListenLang;
}) {
  return audio ? <AudioListen audio={audio} targetId={targetId} lang={lang} /> : <SpeechListen title={title} targetId={targetId} lang={lang} />;
}
