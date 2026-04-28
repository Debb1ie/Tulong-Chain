// src/components/FeedbackModal.tsx
import { useState, useEffect } from "react";
import type { WalletState } from "../types";

interface Props {
  wallet: WalletState;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: FeedbackData) => void;
}

export interface FeedbackData {
  walletAddress: string;
  email: string;
  name: string;
  rating: number;
  feedback: string;
  timestamp: number;
}

const RATING_EMOJI = ["😞", "😕", "😐", "🙂", "🤩"];

export default function FeedbackModal({ wallet, isOpen, onClose, onSubmit }: Props) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [rating, setRating] = useState(5);
  const [feedback, setFeedback] = useState("");
  const [submitted, setSubmitted] = useState(false);

  // Pre-fill wallet address (readonly)
  const walletAddress = wallet.address || "";

  // Prevent background scroll when modal open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data: FeedbackData = {
      walletAddress,
      email,
      name,
      rating,
      feedback,
      timestamp: Date.now(),
    };
    onSubmit(data);
    setSubmitted(true);
    // Auto-close after 1.5 seconds
    setTimeout(() => {
      onClose();
    }, 1500);
  };

  if (!isOpen) return null;

  return (
    <div className="feedback-modal-overlay">
      <div className="feedback-modal">
        <button className="feedback-close" onClick={onClose} aria-label="Close">
          ×
        </button>

        {!submitted ? (
          <>
            <div className="feedback-header">
              <span className="feedback-icon">💬</span>
              <h2 className="feedback-title">Help Improve TulongChain</h2>
              <p className="feedback-sub">
                Your feedback shapes the next version. This takes 30 seconds.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="feedback-form">
              <div className="feedback-field">
                <label htmlFor="wallet" className="feedback-label">Wallet Address</label>
                <input
                  id="wallet"
                  type="text"
                  value={walletAddress}
                  disabled
                  className="feedback-input feedback-input-readonly"
                />
                <span className="feedback-hint">Auto-filled from your Freighter wallet</span>
              </div>

              <div className="feedback-field">
                <label htmlFor="name" className="feedback-label">Name (optional)</label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name or nickname"
                  className="feedback-input"
                />
              </div>

              <div className="feedback-field">
                <label htmlFor="email" className="feedback-label">Email (optional)</label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="for updates on phase 2"
                  className="feedback-input"
                />
              </div>

              <div className="feedback-field feedback-field-rating">
                <label className="feedback-label">How would you rate TulongChain?</label>
                <div className="rating-stars">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      className={`rating-star ${rating >= star ? "rating-star-active" : ""}`}
                      onClick={() => setRating(star)}
                      aria-label={`Rate ${star} stars`}
                    >
                      {RATING_EMOJI[star - 1]}
                    </button>
                  ))}
                </div>
                <span className="feedback-hint">{RATING_EMOJI[rating - 1]}</span>
              </div>

              <div className="feedback-field">
                <label htmlFor="feedback" className="feedback-label">
                  What can we improve? <span className="feedback-required">*</span>
                </label>
                <textarea
                  id="feedback"
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="e.g., add batch donations, mobile app, multi-sig admin..."
                  rows={4}
                  required
                  className="feedback-textarea"
                />
              </div>

              <div className="feedback-actions">
                <button
                  type="button"
                  className="feedback-btn feedback-btn-secondary"
                  onClick={onClose}
                >
                  Skip
                </button>
                <button
                  type="submit"
                  className="feedback-btn feedback-btn-primary"
                  disabled={!feedback.trim()}
                >
                  Submit Feedback
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className="feedback-success">
            <span className="feedback-success-icon">✓</span>
            <h3>Thank you!</h3>
            <p>Your feedback has been recorded. Together we'll build a better relief system.</p>
          </div>
        )}
      </div>
    </div>
  );
}
