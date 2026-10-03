import React, { useCallback, useEffect, useId, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { profile } from "../data/profile";
import {
  downloadEmailDraft,
  isEmailAddress,
  MAX_ATTACHMENT_BYTES,
  openEmailDraft,
} from "../utils/emailDraft";
import FullScreenSection from "./FullScreenSection";
import Material from "./Material";
import RichTextEditor from "./contact/RichTextEditor";
import "./ContactEnvelope.css";

const FLAP_OPEN_MS = 1_500;
const LETTER_RISE_MS = 700;
const FOLD_LETTER_MS = 2_700;
const SEAL_ENVELOPE_MS = 1_200;
const recipientName = profile.name.replace(/\s*\([^)]*\)\s*/, " ").trim();

const getPlainText = (element) =>
  (element?.innerText || element?.textContent || "")
    .replace(/\u00a0/g, " ")
    .trim();

const ContactMeSection = () => {
  const [phase, setPhase] = useState("closed");
  const [draft, setDraft] = useState({ from: "", cc: "", subject: "" });
  const [bodyHtml, setBodyHtml] = useState("");
  const [attachments, setAttachments] = useState([]);
  const [fieldErrors, setFieldErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [notice, setNotice] = useState(null);
  const [pendingAction, setPendingAction] = useState(null);
  const [foldHeight, setFoldHeight] = useState(720);

  const sectionId = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const letterId = `contact-letter-${sectionId}`;
  const bodyId = `contact-body-${sectionId}`;
  const subjectId = `contact-subject-${sectionId}`;
  const fromId = `contact-from-${sectionId}`;
  const ccId = `contact-cc-${sectionId}`;
  const fileInputId = `contact-files-${sectionId}`;

  const reducedMotion = useReducedMotion();
  const timerIdsRef = useRef(new Set());
  const mountedRef = useRef(false);
  const sealRef = useRef(null);
  const directEmailRef = useRef(null);
  const letterRef = useRef(null);
  const fromRef = useRef(null);
  const ccRef = useRef(null);
  const subjectRef = useRef(null);
  const bodyRef = useRef(null);
  const fileInputRef = useRef(null);
  const attachButtonRef = useRef(null);
  const errorRef = useRef(null);
  const restoreSealFocusRef = useRef(false);
  const focusFormErrorRef = useRef(false);
  const actionIntentRef = useRef("open");

  const clearTimers = useCallback(() => {
    timerIdsRef.current.forEach((timerId) => window.clearTimeout(timerId));
    timerIdsRef.current.clear();
  }, []);

  const schedule = useCallback((callback, delay) => {
    const timerId = window.setTimeout(() => {
      timerIdsRef.current.delete(timerId);
      callback();
    }, delay);
    timerIdsRef.current.add(timerId);
    return timerId;
  }, []);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      clearTimers();
    };
  }, [clearTimers]);

  useEffect(() => {
    if (phase === "open") {
      subjectRef.current?.focus({ preventScroll: true });
      const letter = letterRef.current;
      const letterTop = letter?.getBoundingClientRect().top ?? 0;
      const headerBottom =
        document.querySelector(".home-header")?.getBoundingClientRect()
          .bottom || 0;
      if (
        letter &&
        (letterTop < headerBottom + 12 || letterTop > window.innerHeight - 120)
      ) {
        letter.scrollIntoView({
          block: "start",
          behavior: reducedMotion ? "instant" : "smooth",
        });
      }
    }

    if (phase === "closed" && restoreSealFocusRef.current) {
      restoreSealFocusRef.current = false;
      sealRef.current?.focus({ preventScroll: true });
    }
  }, [phase, reducedMotion]);

  useEffect(() => {
    if (!formError || !focusFormErrorRef.current) return;
    focusFormErrorRef.current = false;
    errorRef.current?.focus({ preventScroll: true });
  }, [formError]);

  const openLetter = () => {
    if (phase !== "closed") return;
    clearTimers();
    restoreSealFocusRef.current = false;
    setFormError("");
    setFieldErrors({});
    setNotice(null);
    setPhase("opening-flap");

    schedule(
      () => {
        setPhase("opening-paper");
        schedule(() => setPhase("open"), reducedMotion ? 0 : LETTER_RISE_MS);
      },
      reducedMotion ? 0 : FLAP_OPEN_MS,
    );
  };

  const closeLetter = () => {
    if (!/^opening-|^open$/.test(phase) || pendingAction) return;
    clearTimers();
    restoreSealFocusRef.current = true;
    directEmailRef.current?.focus({ preventScroll: true });
    setFoldHeight(letterRef.current?.getBoundingClientRect().height || 720);
    setPhase("folding");

    schedule(
      () => {
        setPhase("sealing");
        schedule(
          () => setPhase("closed"),
          reducedMotion ? 0 : SEAL_ENVELOPE_MS,
        );
      },
      reducedMotion ? 0 : FOLD_LETTER_MS,
    );
  };

  const handleSectionKeyDown = (event) => {
    if (
      event.key !== "Escape" ||
      event.defaultPrevented ||
      pendingAction ||
      !/^opening-|^open$/.test(phase)
    ) {
      return;
    }
    event.preventDefault();
    closeLetter();
  };

  const clearStatus = () => {
    if (notice) setNotice(null);
    if (formError) setFormError("");
  };

  const updateField = (field) => (event) => {
    const value = event.target.value;
    setDraft((current) => ({ ...current, [field]: value }));
    setFieldErrors((current) => {
      if (!current[field]) return current;
      const next = { ...current };
      delete next[field];
      return next;
    });
    clearStatus();
  };

  const updateBody = (html) => {
    setBodyHtml(html);
    setFieldErrors((current) => {
      if (!current.body) return current;
      const next = { ...current };
      delete next.body;
      return next;
    });
    clearStatus();
  };

  const reportError = (message) => {
    focusFormErrorRef.current = true;
    setFormError(message);
  };

  const validateDraft = () => {
    const nextErrors = {};
    const from = draft.from.trim();
    const ccAddresses = draft.cc.trim()
      ? draft.cc
          .split(/[;,]/)
          .map((address) => address.trim())
          .filter(Boolean)
      : [];

    if (from && !isEmailAddress(from)) {
      nextErrors.from = "Enter a valid email address.";
    }
    if (ccAddresses.some((address) => !isEmailAddress(address))) {
      nextErrors.cc = "Use valid email addresses separated by commas.";
    } else if (ccAddresses.length > 10) {
      nextErrors.cc = "Use no more than 10 Cc recipients.";
    }
    if (!draft.subject.trim()) {
      nextErrors.subject = "Add a subject for your letter.";
    }
    if (!getPlainText(bodyRef.current)) {
      nextErrors.body = "Write a few words before opening your draft.";
    }

    setFieldErrors(nextErrors);
    const firstInvalid = [
      ["from", fromRef],
      ["cc", ccRef],
      ["subject", subjectRef],
      ["body", bodyRef],
    ].find(([field]) => nextErrors[field]);
    if (firstInvalid) {
      firstInvalid[1].current?.focus({ preventScroll: true });
      return false;
    }
    return true;
  };

  const handleFileChange = (event) => {
    const selectedFiles = Array.from(event.target.files || []);
    event.target.value = "";
    if (!selectedFiles.length) return;

    const nextFiles = [...attachments, ...selectedFiles];
    const totalSize = nextFiles.reduce((sum, file) => sum + file.size, 0);
    if (totalSize > MAX_ATTACHMENT_BYTES) {
      reportError(
        "Attachments must total 10 MB or less. Remove a file and try again.",
      );
      return;
    }

    setAttachments(nextFiles);
    clearStatus();
    schedule(() => attachButtonRef.current?.focus(), 0);
  };

  const removeAttachment = (removeIndex) => {
    setAttachments((current) =>
      current.filter((_, index) => index !== removeIndex),
    );
    clearStatus();
    schedule(() => attachButtonRef.current?.focus(), 0);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (phase !== "open" || pendingAction) return;

    const action =
      event.nativeEvent?.submitter?.value || actionIntentRef.current || "open";
    actionIntentRef.current = "open";
    setFormError("");
    setFieldErrors({});
    if (!validateDraft()) return;

    if (action === "open" && attachments.length > 0) {
      reportError(
        "Open email app cannot include attachments. Choose Save full draft to keep them with your message.",
      );
      return;
    }

    const content = {
      from: draft.from.trim(),
      cc: draft.cc.trim(),
      subject: draft.subject.trim(),
      html: bodyRef.current?.innerHTML || bodyHtml,
      attachments,
    };
    setPendingAction(action);

    try {
      const result =
        action === "save"
          ? await downloadEmailDraft(content)
          : await openEmailDraft(content);
      if (!mountedRef.current) return;
      setNotice(result);
      setPendingAction(null);
      closeLetter();
    } catch (error) {
      if (!mountedRef.current) return;
      setPendingAction(null);
      reportError(
        error?.message ||
          (action === "save"
            ? "The draft could not be saved. Your letter and attachments are still here."
            : "The email draft could not be opened. Your letter is still here."),
      );
    }
  };

  const bodyText = getPlainText(bodyRef.current);
  const letterAvailable = phase === "open";
  const isClosing = phase === "folding";
  const className = `contact-correspondence contact-phase-${phase}`;
  const totalAttachmentBytes = attachments.reduce(
    (sum, file) => sum + file.size,
    0,
  );

  return (
    <FullScreenSection
      id="connect-section"
      lang="en"
      backgroundColor="var(--bg-primary)"
      px="var(--page-gutter)"
      py={{ base: 12, md: 20 }}
      spacing={0}
      alignItems="stretch"
    >
      <div className={className} onKeyDown={handleSectionKeyDown}>
        <div className="contact-intro">
          <h2>
            Let&apos;s <em>connect.</em>
          </h2>
          <a
            ref={directEmailRef}
            className="contact-direct-email"
            href={`mailto:${profile.email}`}
          >
            <svg aria-hidden="true" viewBox="0 0 24 24">
              <rect x="3" y="5" width="18" height="14" rx="2" />
              <path d="m3 6 9 7 9-7" />
            </svg>
            <span>{profile.email}</span>
          </a>
          {notice && (
            <div
              className="contact-handoff-notice"
              role="status"
              aria-live="polite"
            >
              <span className="contact-notice-mark" aria-hidden="true">
                ✓
              </span>
              <span>
                <strong>{notice.title}</strong>
                {notice.description && <small>{notice.description}</small>}
              </span>
            </div>
          )}
        </div>

        <div
          className={`contact-scene ${phase === "closed" ? "" : "is-expanded"}`}
          data-phase={phase}
        >
          <div className="contact-ink-wash" aria-hidden="true" />

          <div className="contact-envelope" aria-hidden="true">
            <div className="contact-envelope-back" />
            <div className="contact-envelope-lining" />
            <div className="contact-envelope-flap">
              <svg
                className="contact-flap-face contact-flap-front"
                viewBox="0 0 640 230"
                preserveAspectRatio="none"
              >
                <defs>
                  <linearGradient
                    id={`contact-flap-front-${sectionId}`}
                    x2=".2"
                    y2="1"
                  >
                    <stop
                      offset="0"
                      stopColor="var(--contact-envelope-light)"
                    />
                    <stop offset=".7" stopColor="var(--contact-envelope-mid)" />
                    <stop offset="1" stopColor="var(--contact-envelope-deep)" />
                  </linearGradient>
                </defs>
                <path
                  d="M14 6H626Q638 6 630 17C548 92 447 165 334 215Q320 222 306 215C193 165 92 92 10 17Q2 6 14 6Z"
                  fill={`url(#contact-flap-front-${sectionId})`}
                  stroke="var(--contact-envelope-edge)"
                  strokeWidth="1.3"
                />
                <path
                  d="M18 10H622M20 18C105 94 203 157 308 209Q320 216 332 209C437 157 535 94 620 18"
                  fill="none"
                  stroke="var(--contact-envelope-highlight)"
                  strokeWidth="1"
                />
              </svg>
              <svg
                className="contact-flap-face contact-flap-reverse"
                viewBox="0 0 640 230"
                preserveAspectRatio="none"
              >
                <defs>
                  <linearGradient
                    id={`contact-flap-back-${sectionId}`}
                    x2="0"
                    y2="1"
                  >
                    <stop offset="0" stopColor="var(--contact-lining-light)" />
                    <stop offset="1" stopColor="var(--contact-lining-deep)" />
                  </linearGradient>
                  <pattern
                    id={`contact-flap-lines-${sectionId}`}
                    width="10"
                    height="10"
                    patternUnits="userSpaceOnUse"
                  >
                    <path
                      d="M0 10 10 0"
                      stroke="var(--contact-lining-line)"
                      strokeWidth=".65"
                    />
                  </pattern>
                </defs>
                <path
                  d="M14 6H626Q638 6 630 17C548 92 447 165 334 215Q320 222 306 215C193 165 92 92 10 17Q2 6 14 6Z"
                  fill={`url(#contact-flap-back-${sectionId})`}
                  stroke="var(--contact-envelope-edge)"
                  strokeWidth="1"
                />
                <path
                  d="M14 6H626Q638 6 630 17C548 92 447 165 334 215Q320 222 306 215C193 165 92 92 10 17Q2 6 14 6Z"
                  fill={`url(#contact-flap-lines-${sectionId})`}
                  opacity=".38"
                />
              </svg>
            </div>
            <svg
              className="contact-envelope-front"
              viewBox="0 0 640 360"
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient
                  id={`contact-pocket-${sectionId}`}
                  x2=".72"
                  y2="1"
                >
                  <stop offset="0" stopColor="var(--contact-envelope-light)" />
                  <stop offset=".52" stopColor="var(--contact-envelope-mid)" />
                  <stop offset="1" stopColor="var(--contact-envelope-deep)" />
                </linearGradient>
              </defs>
              <path
                d="M2 22C96 95 201 157 313 211Q320 215 327 211C439 157 544 95 638 22V348Q638 357 629 357H11Q2 357 2 348Z"
                fill={`url(#contact-pocket-${sectionId})`}
                stroke="var(--contact-envelope-edge)"
                strokeWidth="1"
              />
              <path
                d="M8 27C105 102 205 160 313 213Q320 216 327 213C435 160 535 102 632 27M8 351C113 278 209 235 278 198M632 351C527 278 431 235 362 198"
                fill="none"
                stroke="var(--contact-envelope-highlight)"
                strokeWidth="1"
              />
              <path
                d="M8 354C115 280 211 237 282 199M632 354C525 280 429 237 358 199"
                fill="none"
                stroke="var(--contact-envelope-crease)"
                strokeWidth=".7"
              />
            </svg>
            <div className="contact-envelope-address">
              <span>{profile.name}</span>
              <small>Toronto, Canada</small>
            </div>
            <span className="contact-envelope-emboss">
              Personal correspondence
            </span>
          </div>

          <button
            ref={sealRef}
            type="button"
            className="contact-wax-seal"
            aria-expanded={phase !== "closed"}
            aria-controls={letterId}
            aria-label={
              phase === "closed"
                ? "Open the letter to connect"
                : "Letter envelope"
            }
            tabIndex={phase === "closed" ? 0 : -1}
            onClick={openLetter}
          >
            <span className="contact-wax-seal-rim" aria-hidden="true" />
            <span className="contact-wax-seal-word">Connect</span>
          </button>
          {phase === "closed" && (
            <p className="contact-open-prompt" aria-hidden="true">
              Open a letter <span>↗</span>
            </p>
          )}

          <div
            className={`contact-fold-proxy ${isClosing ? "is-folding" : ""}`}
            aria-hidden="true"
            inert
            style={{ "--contact-fold-height": `${foldHeight}px` }}
          >
            <div className="contact-fold-panel contact-fold-panel-top">
              <div className="contact-fold-face">
                <span>To · {recipientName}</span>
                <small>{draft.subject || "Personal correspondence"}</small>
              </div>
            </div>
            <div className="contact-fold-panel contact-fold-panel-middle">
              <div className="contact-fold-face">
                <p>{bodyText.slice(0, 230) || "A personal note"}</p>
              </div>
            </div>
            <div className="contact-fold-panel contact-fold-panel-bottom">
              <div className="contact-fold-face">
                <span>{draft.from || "Visitor"}</span>
                <small>
                  {attachments.length
                    ? `${attachments.length} attached file${attachments.length > 1 ? "s" : ""}`
                    : profile.name}
                </small>
              </div>
            </div>
          </div>

          <article
            ref={letterRef}
            id={letterId}
            className="contact-letter"
            aria-labelledby={`${letterId}-heading`}
            aria-hidden={!letterAvailable}
            inert={!letterAvailable}
          >
            <header className="contact-letter-heading">
              <div>
                <p className="contact-letter-kicker">Personal correspondence</p>
                <h3 id={`${letterId}-heading`}>A letter to Eric</h3>
              </div>
              <button
                type="button"
                className="contact-letter-close"
                aria-label="Fold the letter and keep this draft"
                disabled={!letterAvailable || Boolean(pendingAction)}
                tabIndex={letterAvailable ? 0 : -1}
                onClick={closeLetter}
              >
                <span aria-hidden="true">×</span>
              </button>
            </header>

            <form
              className="contact-letter-form"
              noValidate
              onSubmit={handleSubmit}
            >
              <div className="contact-fields">
                <div className="contact-field contact-field-recipient">
                  <span className="contact-field-label">To</span>
                  <div className="contact-recipient">
                    <strong>{recipientName}</strong>
                    <span>{profile.email}</span>
                  </div>
                </div>

                <div className="contact-field">
                  <label className="contact-field-label" htmlFor={fromId}>
                    From <span>(optional)</span>
                  </label>
                  <input
                    ref={fromRef}
                    id={fromId}
                    name="from"
                    type="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    value={draft.from}
                    disabled={!letterAvailable || Boolean(pendingAction)}
                    aria-invalid={Boolean(fieldErrors.from)}
                    aria-describedby={
                      fieldErrors.from ? `${fromId}-error` : `${fromId}-help`
                    }
                    onChange={updateField("from")}
                  />
                  <small id={`${fromId}-help`} className="contact-field-help">
                    Your address for a reply. The sending account is chosen in
                    your email app.
                  </small>
                  {fieldErrors.from && (
                    <p id={`${fromId}-error`} className="contact-field-error">
                      {fieldErrors.from}
                    </p>
                  )}
                </div>

                <div className="contact-field">
                  <label className="contact-field-label" htmlFor={ccId}>
                    Cc
                  </label>
                  <input
                    ref={ccRef}
                    id={ccId}
                    name="cc"
                    type="text"
                    inputMode="email"
                    autoComplete="off"
                    placeholder="Add recipients (optional)"
                    value={draft.cc}
                    disabled={!letterAvailable || Boolean(pendingAction)}
                    aria-invalid={Boolean(fieldErrors.cc)}
                    aria-describedby={
                      fieldErrors.cc ? `${ccId}-error` : undefined
                    }
                    onChange={updateField("cc")}
                  />
                  {fieldErrors.cc && (
                    <p id={`${ccId}-error`} className="contact-field-error">
                      {fieldErrors.cc}
                    </p>
                  )}
                </div>

                <div className="contact-field contact-field-subject">
                  <label className="contact-field-label" htmlFor={subjectId}>
                    Subject
                  </label>
                  <input
                    ref={subjectRef}
                    id={subjectId}
                    name="subject"
                    type="text"
                    autoComplete="off"
                    maxLength={200}
                    placeholder="A conversation about your research"
                    value={draft.subject}
                    disabled={!letterAvailable || Boolean(pendingAction)}
                    aria-required="true"
                    aria-invalid={Boolean(fieldErrors.subject)}
                    aria-describedby={
                      fieldErrors.subject ? `${subjectId}-error` : undefined
                    }
                    onChange={updateField("subject")}
                  />
                  {fieldErrors.subject && (
                    <p
                      id={`${subjectId}-error`}
                      className="contact-field-error"
                    >
                      {fieldErrors.subject}
                    </p>
                  )}
                </div>
              </div>

              <div className="contact-writing">
                <div className="contact-writing-label-row">
                  <label
                    id={`${bodyId}-label`}
                    className="contact-field-label"
                    htmlFor={bodyId}
                  >
                    Letter content
                  </label>
                  <span>Write in your own words</span>
                </div>
                <RichTextEditor
                  ref={bodyRef}
                  id={bodyId}
                  ariaLabelledBy={`${bodyId}-label`}
                  disabled={!letterAvailable || Boolean(pendingAction)}
                  ariaDescribedBy={
                    fieldErrors.body ? `${bodyId}-error` : undefined
                  }
                  hasError={Boolean(fieldErrors.body)}
                  onChange={updateBody}
                />
                {fieldErrors.body && (
                  <p id={`${bodyId}-error`} className="contact-field-error">
                    {fieldErrors.body}
                  </p>
                )}
              </div>

              <div className="contact-attachments" aria-live="polite">
                <div className="contact-attachment-heading">
                  <span className="contact-field-label">Attachments</span>
                  <small>
                    {attachments.length
                      ? `${(totalAttachmentBytes / 1024 / 1024).toFixed(1)} MB of 10 MB`
                      : "Up to 10 MB total"}
                  </small>
                </div>
                {attachments.length > 0 && (
                  <ul
                    className="contact-attachment-list"
                    aria-label="Attached files"
                  >
                    {attachments.map((file, index) => (
                      <li
                        className="contact-attachment"
                        key={`${file.name}-${file.lastModified}-${index}`}
                      >
                        <span
                          className="contact-attachment-name"
                          title={file.name}
                        >
                          {file.name}
                        </span>
                        <small>
                          {Math.max(1, Math.ceil(file.size / 1024))} KB
                        </small>
                        <button
                          type="button"
                          aria-label={`Remove ${file.name}`}
                          disabled={!letterAvailable || Boolean(pendingAction)}
                          onClick={() => removeAttachment(index)}
                        >
                          <span aria-hidden="true">×</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
                <input
                  ref={fileInputRef}
                  id={fileInputId}
                  className="contact-file-input"
                  type="file"
                  multiple
                  tabIndex={-1}
                  disabled={!letterAvailable || Boolean(pendingAction)}
                  onChange={handleFileChange}
                />
                <button
                  ref={attachButtonRef}
                  type="button"
                  className="contact-attach-button"
                  aria-controls={fileInputId}
                  disabled={!letterAvailable || Boolean(pendingAction)}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <span aria-hidden="true">＋</span> Attach a file
                </button>
              </div>

              {formError && (
                <p
                  ref={errorRef}
                  className="contact-form-error"
                  role="alert"
                  tabIndex={-1}
                >
                  {formError}
                </p>
              )}

              <footer className="contact-letter-actions">
                <p className="contact-action-hint">
                  Open email app uses plain text. Save full draft keeps
                  formatting and attachments.
                </p>
                <div className="contact-action-row">
                  <Material
                    as="button"
                    type="submit"
                    name="draftAction"
                    value="open"
                    opaque
                    className="contact-action contact-action-primary home-connect-button pressable"
                    disabled={!letterAvailable || Boolean(pendingAction)}
                    aria-busy={pendingAction === "open"}
                    onClick={() => {
                      actionIntentRef.current = "open";
                    }}
                  >
                    {pendingAction === "open"
                      ? "Opening draft…"
                      : "Open email app"}
                  </Material>
                  <Material
                    as="button"
                    type="submit"
                    name="draftAction"
                    value="save"
                    quiet
                    className="contact-action contact-action-secondary pressable"
                    disabled={!letterAvailable || Boolean(pendingAction)}
                    aria-busy={pendingAction === "save"}
                    onClick={() => {
                      actionIntentRef.current = "save";
                    }}
                  >
                    {pendingAction === "save"
                      ? "Saving draft…"
                      : "Save full draft"}
                  </Material>
                </div>
              </footer>
            </form>
          </article>
        </div>
      </div>
    </FullScreenSection>
  );
};

export default ContactMeSection;
