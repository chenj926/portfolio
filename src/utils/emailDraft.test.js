import { TextEncoder } from "util";
import { webcrypto } from "crypto";
import {
  buildEmailDraft,
  buildMailtoDraft,
  normalizeLetter,
  MAX_ATTACHMENT_BYTES,
} from "./emailDraft";

beforeAll(() => {
  global.TextEncoder = TextEncoder;
  Object.defineProperty(window, "crypto", {
    value: webcrypto,
    configurable: true,
  });
});
const draft = {
  from: "reader@example.org",
  cc: "colleague@example.org",
  subject: "A conversation & an idea",
  html: "<p>Dear Eric,</p><p>A <strong>shared</strong> idea.</p>",
  attachments: [],
};
const readBlob = (blob) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsText(blob);
  });

test("exports only the editor's formatting and readable plain text", () => {
  const result = normalizeLetter(
    '<p onclick="bad()">Dear <b>Eric</b>,</p><script>bad()</script><iframe>bad</iframe><svg><script>bad()</script></svg><p><a href="javascript:bad()">A thought</a><br><i>Thanks</i></p>',
  );
  expect(result.html).toBe(
    "<p>Dear <b>Eric</b>,</p><p>A thought<br><i>Thanks</i></p>",
  );
  expect(result.text).toBe("Dear Eric,\nA thought\nThanks");
});

test("mailto safely encodes fields and leaves the sending account with the client", () => {
  const uri = buildMailtoDraft({ ...draft, cc: ` ${draft.cc},; ` });
  expect(uri).toMatch(/^mailto:jialuo.chen@mail.utoronto.ca\?/);
  const fields = new URLSearchParams(uri.split("?")[1]);
  expect(fields.get("subject")).toBe(draft.subject);
  expect(fields.get("cc")).toBe(draft.cc);
  expect(fields.get("from")).toBeNull();
  expect(fields.get("body")).toContain(
    "A shared idea.\r\n\r\nReply to: reader@example.org",
  );
});

test("does not silently lose attachments or truncate long messages", () => {
  expect(() =>
    buildMailtoDraft({ ...draft, attachments: [new File(["x"], "note.txt")] }),
  ).toThrow(/Save full draft/);
  expect(() => buildMailtoDraft({ ...draft, html: "x".repeat(3000) })).toThrow(
    /Save full draft/,
  );
});

test.each([
  { subject: "hello\r\nBcc: victim@example.org" },
  { from: "reader@example.org\r\nBcc: victim@example.org" },
  { cc: "not an address" },
])("rejects invalid addresses and injected headers: %j", (invalid) => {
  expect(() => buildMailtoDraft({ ...draft, ...invalid })).toThrow();
});

test("full draft preserves Unicode, safe HTML and exact attachment bytes", async () => {
  const source = await readBlob(
    await buildEmailDraft({
      ...draft,
      subject: "交流与研究 — a shared idea",
      html: "<p>你好，<b>Eric</b></p>",
      attachments: [
        new File([new Uint8Array([0, 1, 127, 128, 255])], "研究记录.txt", {
          type: "application/octet-stream",
        }),
      ],
    }),
  );
  expect(source).toContain("X-Unsent: 1\r\n");
  expect(source).toContain("Content-Type: multipart/alternative");
  expect(source).toContain("Content-Disposition: attachment");
  expect(source).toContain("filename*0*=UTF-8''");
  // A second plain filename parameter makes some MIME readers discard the
  // Unicode continuation. Emit only the RFC 2231 filename.
  expect(source).not.toMatch(/filename=/);
  expect(source).toContain("AAF/gP8=");
  const subject = source.match(/Subject: =\?UTF-8\?B\?([^?]+)\?=/)[1];
  expect(Buffer.from(subject, "base64").toString("utf8")).toBe(
    "交流与研究 — a shared idea",
  );
  const parts = [
    ...source.matchAll(
      /Content-Type: text\/(plain|html); charset=UTF-8\r\nContent-Transfer-Encoding: base64\r\n\r\n([A-Za-z0-9+/=\r\n]+)\r\n--/g,
    ),
  ];
  expect(parts).toHaveLength(2);
  expect(
    Buffer.from(parts[1][2].replace(/\s/g, ""), "base64").toString("utf8"),
  ).toBe("<p>你好，<b>Eric</b></p>");
  expect(source.split("\r\n").every((line) => line.length < 998)).toBe(true);
  expect(source.replace(/\r\n/g, "")).not.toMatch(/[\r\n]/);
});

test("encoded long subjects and filenames keep legal line lengths", async () => {
  const subject = "汉字 🌸".repeat(20);
  const source = await readBlob(
    await buildEmailDraft({
      ...draft,
      subject,
      attachments: [new File(["hello"], "青花".repeat(80) + ".txt")],
    }),
  );
  const header = source.match(/Subject: ([\s\S]+?)\r\nMIME-Version/)[1];
  const restored = [...header.matchAll(/=\?UTF-8\?B\?([^?]+)\?=/g)]
    .map((match) => Buffer.from(match[1], "base64").toString("utf8"))
    .join("");
  expect(restored).toBe(subject);
  expect(source).toContain("filename*1*=");
  expect(source.split("\r\n").every((line) => line.length < 998)).toBe(true);
});

test("attachment budget is checked before reading any file", async () => {
  await expect(
    buildEmailDraft({
      ...draft,
      attachments: [{ name: "large.txt", size: MAX_ATTACHMENT_BYTES + 1 }],
    }),
  ).rejects.toThrow(/10 MB/);
});
