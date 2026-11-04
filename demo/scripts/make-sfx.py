#!/usr/bin/env python3
"""Synthesize the demo's sound effects (no samples, no licensing): writes WAVs to demo/public/sfx/.
Run: python3 scripts/make-sfx.py"""
import math
import random
import struct
import wave
from pathlib import Path

SR = 48000
OUT = Path(__file__).resolve().parent.parent / "public" / "sfx"
random.seed(7)


def write(name, samples, gain=0.9):
    peak = max(1e-9, max(abs(s) for s in samples))
    OUT.mkdir(parents=True, exist_ok=True)
    with wave.open(str(OUT / f"{name}.wav"), "wb") as w:
        w.setnchannels(1)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes(b"".join(struct.pack("<h", int(s / peak * gain * 32767)) for s in samples))


def lowpass(x, a):
    y, out = 0.0, []
    for s in x:
        y += a * (s - y)
        out.append(y)
    return out


def key(i):
    """Soft mechanical key: short filtered noise tick plus a tiny body thump."""
    n = int(SR * 0.045)
    pitch = 1 + (i - 2) * 0.06
    noise = lowpass([random.uniform(-1, 1) for _ in range(n)], 0.35)
    out = []
    for t in range(n):
        env = math.exp(-t / (SR * 0.006))
        body = math.sin(2 * math.pi * 180 * pitch * t / SR) * math.exp(-t / (SR * 0.012)) * 0.6
        out.append(noise[t] * env + body)
    return out


def pop():
    """Rounded bubble pop: fast downward sine sweep with a quick decay."""
    n = int(SR * 0.09)
    out, phase = [], 0.0
    for t in range(n):
        f = 1100 * math.exp(-t / (SR * 0.03)) + 420
        phase += 2 * math.pi * f / SR
        env = (1 - math.exp(-t / (SR * 0.002))) * math.exp(-t / (SR * 0.025))
        out.append(math.sin(phase) * env)
    return out


def whoosh():
    """Air swell: noise through a sweeping lowpass, rising then falling."""
    n = int(SR * 0.55)
    out, y = [], 0.0
    for t in range(n):
        p = t / n
        a = 0.02 + 0.25 * math.sin(math.pi * p) ** 2
        y += a * (random.uniform(-1, 1) - y)
        out.append(y * math.sin(math.pi * p) ** 1.5)
    return out


def thud():
    """Low soft hit for the outro words."""
    n = int(SR * 0.35)
    out, phase = [], 0.0
    for t in range(n):
        f = 120 * math.exp(-t / (SR * 0.05)) + 55
        phase += 2 * math.pi * f / SR
        out.append(math.sin(phase) * math.exp(-t / (SR * 0.09)))
    return out


def chime():
    """Bright two-note chime for the payoff (C6 then G6), gentle bell decay."""
    n = int(SR * 1.2)
    out = []
    for t in range(n):
        s = 0.0
        for f, start, amp in ((1046.5, 0, 1.0), (1568.0, 0.09, 0.8)):
            tt = t / SR - start
            if tt >= 0:
                env = (1 - math.exp(-tt / 0.004)) * math.exp(-tt / 0.35)
                s += amp * env * (math.sin(2 * math.pi * f * tt) + 0.3 * math.sin(2 * math.pi * 2 * f * tt))
        out.append(s)
    return out


if __name__ == "__main__":
    for i in range(5):
        write(f"key{i}", key(i), 0.8)
    write("pop", pop(), 0.85)
    write("whoosh", whoosh(), 0.8)
    write("thud", thud(), 0.9)
    write("chime", chime(), 0.7)
    print("wrote", sorted(p.name for p in OUT.glob("*.wav")))
