"use client";

import Image from "next/image";

interface HeartbeatLoaderProps {
  message?: string;
}

export default function HeartbeatLoader({
  message = "Preparing your learning experience",
}: HeartbeatLoaderProps) {
  return (
    <main
      className="qn-loader"
      role="status"
      aria-label="QbankNurse loading"
    >
      <div className="qn-loader__glow qn-loader__glow--top" />
      <div className="qn-loader__glow qn-loader__glow--bottom" />

      <div className="qn-loader__content">
        <div className="qn-loader__heart">
          <div className="qn-loader__heart-glow" />

          {/* ECG sits behind the anatomical heart */}
          <svg
            className="qn-loader__ecg"
            viewBox="0 0 600 180"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <path
              d="M0 90 H130 L150 90 L169 65 L190 125 L215 18 L241 157 L265 90 H330 L350 90 L370 65 L390 125 L415 18 L441 157 L465 90 H600"
              fill="none"
              stroke="white"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="qn-loader__ecg-line"
            />
          </svg>

          <Image
            src="/images/clinical/qbanknurse-anatomical-heart.png"
            alt=""
            width={1136}
            height={1385}
            priority
            className="qn-loader__heart-image"
          />
        </div>

        <div className="qn-loader__brand">
          <span>Qbank</span>
          <span className="qn-loader__brand-accent">Nurse</span>
          <span className="qn-loader__brand-dot">.</span>
        </div>

        <p className="qn-loader__message">{message}</p>

        <div
          className="qn-loader__progress"
          aria-hidden="true"
        >
          <span />
        </div>

        <p className="qn-loader__caption">
          YOUR JOURNEY TO BETTER NURSING STARTS HERE
        </p>
      </div>
    </main>
  );
}