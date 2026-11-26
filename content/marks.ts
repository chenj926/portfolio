// The marks of the places he studies and works at, shown on small paper plates beside an entry. A new school,
// lab or employer adds its logo to public/images/marks and one line here; entries then name it by its key.
export const marks = {
  uoft: { src: "/images/marks/uoft_crest.png", w: 206, h: 490, name: "University of Toronto" },
  sjtu: { src: "/images/marks/sjtu_logo.png", w: 316, h: 316, name: "Shanghai Jiao Tong University" },
  jana: { src: "/images/marks/jana.webp", w: 512, h: 162, name: "JANA Corporation" },
} as const;

export type MarkId = keyof typeof marks;
