import { profile } from "../data/profile";

// This module owns mail-client handoff and MIME serialization. It never sends mail.
// mailto: RFC 6068; MIME: RFC 2045/2046/2047 and RFC 2231 filename parameters.
export const MAX_ATTACHMENT_BYTES = 10 * 1024 * 1024;
const CRLF = "\r\n";
const EMAIL =
  /^[a-z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-z0-9](?:[a-z0-9.-]*[a-z0-9])?\.[a-z]{2,63}$/i;
const MARKS = new Set(["P", "DIV", "BR", "B", "STRONG", "I", "EM", "U"]);
const OMIT = new Set([
  "SCRIPT",
  "STYLE",
  "IFRAME",
  "OBJECT",
  "SVG",
  "MATH",
  "TEMPLATE",
]);

function singleLine(value, label, maximum = 200) {
  const text = String(value || "").trim();
  if (/[\r\n\0]/.test(text) || text.length > maximum) {
    throw new Error(
      `Please keep ${label} on one line, within ${maximum} characters.`,
    );
  }
  return text;
}

export function isEmailAddress(value) {
  const address = String(value || "").trim();
  return address.length <= 254 && EMAIL.test(address);
}

function emailAddress(value) {
  const address = singleLine(value, "each email address", 254);
  if (!isEmailAddress(address))
    throw new Error("Please enter a valid email address.");
  return address;
}

// Copy only the editor's formatting vocabulary; never keep attributes, embeds,
// style rules, links, or event handlers from pasted/dropped markup.
export function normalizeLetter(html) {
  const document = new DOMParser().parseFromString(
    String(html || ""),
    "text/html",
  );
  const clean = document.createElement("div");
  const copy = (node, parent) => {
    if (node.nodeType === 3) {
      parent.append(document.createTextNode(node.textContent));
      return;
    }
    if (node.nodeType !== 1 || OMIT.has(node.tagName.toUpperCase())) return;
    const target = MARKS.has(node.tagName.toUpperCase())
      ? document.createElement(node.tagName.toLowerCase())
      : parent;
    if (target !== parent) parent.append(target);
    [...node.childNodes].forEach((child) => copy(child, target));
  };
  [...document.body.childNodes].forEach((node) => copy(node, clean));
  const plain = (node) => {
    if (node.nodeType === 3) return node.textContent;
    if (node.nodeName === "BR") return "\n";
    const content = [...node.childNodes].map(plain).join("");
    return ["P", "DIV"].includes(node.nodeName) ? `${content}\n` : content;
  };
  return {
    html: clean.innerHTML,
    text: plain(clean)
      .replace(/\u00a0/g, " ")
      .replace(/\n{3,}/g, "\n\n")
      .trim(),
  };
}

function prepare(draft) {
  const subject = singleLine(draft.subject, "the subject");
  const letter = normalizeLetter(draft.html);
  if (!subject) throw new Error("Please give your letter a subject.");
  if (!letter.text)
    throw new Error("Please add a message before opening your draft.");
  if (letter.text.length > 50000)
    throw new Error("Please keep the message within 50,000 characters.");
  const from = draft.from?.trim() ? emailAddress(draft.from) : "";
  const cc = draft.cc?.trim()
    ? draft.cc
        .split(/[,;]/)
        .filter((address) => address.trim())
        .map(emailAddress)
    : [];
  if (cc.length > 10)
    throw new Error("Please use no more than 10 Cc recipients.");
  const attachments = draft.attachments || [];
  if (
    attachments.reduce((total, file) => total + file.size, 0) >
    MAX_ATTACHMENT_BYTES
  ) {
    throw new Error("Please keep attachments under 10 MB in total.");
  }
  return { ...letter, subject, from, cc, attachments };
}

export function buildMailtoDraft(draft) {
  const message = prepare(draft);
  if (message.attachments.length) {
    throw new Error(
      "Choose Save full draft to keep your attachments, then open it in a compatible email app.",
    );
  }
  const text = message.from
    ? `${message.text}\n\nReply to: ${message.from}`
    : message.text;
  const fields = {
    subject: message.subject,
    ...(message.cc.length ? { cc: message.cc.join(",") } : {}),
    body: text.replace(/\r?\n/g, CRLF),
  };
  const url = `mailto:${profile.email}?${Object.entries(fields)
    .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
    .join("&")}`;
  // Conservative OS-protocol budget. A long letter is preserved in a full draft.
  if (url.length > 1900)
    throw new Error(
      "This letter is too long for a reliable email-app link. Choose Save full draft to keep the whole message.",
    );
  return url;
}

export function openEmailDraft(draft) {
  window.location.href = buildMailtoDraft(draft);
  return {
    title: "Continue in your email app",
    description:
      "Review the draft and send it from your account. If nothing opened, check your default email app or save the full draft.",
  };
}

const utf8Base64 = (value) =>
  btoa(
    Array.from(new TextEncoder().encode(value), (byte) =>
      String.fromCharCode(byte),
    ).join(""),
  );
const wrapBase64 = (value) => value.match(/.{1,76}/g)?.join(CRLF) || "";

function encodedSubject(value) {
  const words = [];
  let chunk = "";
  for (const character of value) {
    if (new TextEncoder().encode(chunk + character).length > 42) {
      words.push(chunk);
      chunk = "";
    }
    chunk += character;
  }
  if (chunk) words.push(chunk);
  return words
    .map((word) => `=?UTF-8?B?${utf8Base64(word)}?=`)
    .join(`${CRLF} `);
}

function readAttachment(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result).split(",", 2)[1]);
    reader.onerror = () =>
      reject(
        new Error(
          `Could not read ${file.name}. Remove it and attach it again.`,
        ),
      );
    reader.onabort = () =>
      reject(
        new Error("Reading the attachment was interrupted. Please try again."),
      );
    reader.readAsDataURL(file);
  });
}

export async function buildEmailDraft(draft) {
  const message = prepare(draft);
  const id = Array.from(
    window.crypto.getRandomValues(new Uint32Array(4)),
    (value) => value.toString(16),
  ).join("");
  const mixed = `letter_${id}`,
    alternative = `body_${id}`;
  const lines = [
    `To: ${profile.email}`,
    ...(message.from ? [`From: ${message.from}`] : []),
    ...(message.cc.length ? [`Cc: ${message.cc.join(`,${CRLF} `)}`] : []),
    `Subject: ${encodedSubject(message.subject)}`,
    "MIME-Version: 1.0",
    "X-Unsent: 1",
    `Content-Type: multipart/mixed; boundary="${mixed}"`,
    "",
    `--${mixed}`,
    `Content-Type: multipart/alternative; boundary="${alternative}"`,
    "",
  ];
  for (const [type, body] of [
    ["plain", message.text],
    ["html", message.html],
  ]) {
    lines.push(
      `--${alternative}`,
      `Content-Type: text/${type}; charset=UTF-8`,
      "Content-Transfer-Encoding: base64",
      "",
      wrapBase64(utf8Base64(body.replace(/\r?\n/g, CRLF))),
      "",
    );
  }
  lines.push(`--${alternative}--`, "");
  // Read one bounded attachment at a time, keeping peak allocations predictable.
  for (const file of message.attachments) {
    const name = String(file.name).replace(/[\r\n\0]/g, "");
    const mime = /^[a-z0-9.+-]+\/[a-z0-9.+-]+$/i.test(file.type)
      ? file.type
      : "application/octet-stream";
    const encodedName = Array.from(
      new TextEncoder().encode(name),
      (byte) => `%${byte.toString(16).toUpperCase().padStart(2, "0")}`,
    ).join("");
    const filename = (encodedName.match(/.{1,54}/g) || [""])
      .map(
        (part, index) =>
          ` filename*${index}*=${index === 0 ? "UTF-8''" : ""}${part}`,
      )
      .join(`;${CRLF}`);
    lines.push(
      `--${mixed}`,
      `Content-Type: ${mime}`,
      "Content-Transfer-Encoding: base64",
      "Content-Disposition: attachment;",
      filename,
      "",
      wrapBase64(await readAttachment(file)),
      "",
    );
  }
  lines.push(`--${mixed}--`, "");
  return new Blob([lines.join(CRLF)], { type: "message/rfc822" });
}

export async function downloadEmailDraft(draft) {
  const blob = await buildEmailDraft(draft);
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "letter-to-jialuo-chen.eml";
  document.body.append(link);
  try {
    link.click();
  } finally {
    link.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  return {
    title: "Your full draft is ready",
    description:
      "Open the downloaded .eml file in a compatible desktop email app to review and send it. Formatting and attachments are included; draft support varies by app.",
  };
}
