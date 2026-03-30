import type { Artwork, Child } from "@/types";

export const children: Child[] = [
  {
    id: "riho",
    name: "凛歩",
    birthday: new Date(2021, 3, 9), // 2021年4月9日
    emoji: "🌸",
    color: "#E8927C",
  },
  {
    id: "mitsuki",
    name: "充季",
    birthday: new Date(2023, 11, 24), // 2023年12月24日
    emoji: "🌟",
    color: "#7BAFD4",
  },
];

export const artworks: Artwork[] = [
  // 2026年3月
  {
    id: "1",
    childId: "riho",
    title: "おはなばたけ",
    category: "drawing",
    imageUrl: "/samples/drawing1.svg",
    thumbnailUrl: "/samples/drawing1.svg",
    location: "幼稚園",
    date: new Date(2026, 2, 15),
    memo: "お花がいっぱいの絵を描きました",
    createdAt: new Date(2026, 2, 15),
  },
  {
    id: "2",
    childId: "riho",
    title: "パパとママ",
    category: "drawing",
    imageUrl: "/samples/drawing2.svg",
    thumbnailUrl: "/samples/drawing2.svg",
    location: "おうち",
    date: new Date(2026, 2, 10),
    memo: "家族の絵を描いてくれました",
    createdAt: new Date(2026, 2, 10),
  },
  {
    id: "3",
    childId: "mitsuki",
    title: "くるまのえ",
    category: "drawing",
    imageUrl: "/samples/drawing3.svg",
    thumbnailUrl: "/samples/drawing3.svg",
    location: "おうち",
    date: new Date(2026, 2, 20),
    memo: "はじめて車を描きました！",
    createdAt: new Date(2026, 2, 20),
  },
  {
    id: "4",
    childId: "riho",
    title: "おひなさま",
    category: "craft",
    imageUrl: "/samples/craft1.svg",
    thumbnailUrl: "/samples/craft1.svg",
    location: "幼稚園",
    date: new Date(2026, 2, 3),
    memo: "ひな祭りの工作",
    createdAt: new Date(2026, 2, 3),
  },
  {
    id: "5",
    childId: "mitsuki",
    title: "てがたアート",
    category: "craft",
    imageUrl: "/samples/craft2.svg",
    thumbnailUrl: "/samples/craft2.svg",
    location: "おうち",
    date: new Date(2026, 2, 12),
    memo: "手形を使ったアートに挑戦",
    createdAt: new Date(2026, 2, 12),
  },
  // 2026年2月
  {
    id: "6",
    childId: "riho",
    title: "ゆきだるま",
    category: "drawing",
    imageUrl: "/samples/drawing4.svg",
    thumbnailUrl: "/samples/drawing4.svg",
    location: "幼稚園",
    date: new Date(2026, 1, 20),
    memo: "雪が降った日に描きました",
    createdAt: new Date(2026, 1, 20),
  },
  {
    id: "7",
    childId: "riho",
    title: "バレンタインカード",
    category: "craft",
    imageUrl: "/samples/craft3.svg",
    thumbnailUrl: "/samples/craft3.svg",
    location: "おうち",
    date: new Date(2026, 1, 14),
    memo: "パパへのバレンタインカード",
    createdAt: new Date(2026, 1, 14),
  },
  {
    id: "8",
    childId: "mitsuki",
    title: "ぐるぐるもよう",
    category: "drawing",
    imageUrl: "/samples/drawing5.svg",
    thumbnailUrl: "/samples/drawing5.svg",
    location: "おうち",
    date: new Date(2026, 1, 8),
    memo: "クレヨンでぐるぐる",
    createdAt: new Date(2026, 1, 8),
  },
  // 2026年1月
  {
    id: "9",
    childId: "riho",
    title: "おしょうがつのえ",
    category: "drawing",
    imageUrl: "/samples/drawing6.svg",
    thumbnailUrl: "/samples/drawing6.svg",
    location: "幼稚園",
    date: new Date(2026, 0, 15),
    memo: "お正月の思い出を描きました",
    createdAt: new Date(2026, 0, 15),
  },
  {
    id: "10",
    childId: "riho",
    title: "だるまさん",
    category: "craft",
    imageUrl: "/samples/craft4.svg",
    thumbnailUrl: "/samples/craft4.svg",
    location: "幼稚園",
    date: new Date(2026, 0, 10),
    memo: "紙皿でだるまを作りました",
    createdAt: new Date(2026, 0, 10),
  },
  {
    id: "11",
    childId: "mitsuki",
    title: "シールあそび",
    category: "other",
    imageUrl: "/samples/other1.svg",
    thumbnailUrl: "/samples/other1.svg",
    location: "おうち",
    date: new Date(2026, 0, 5),
    memo: "シールをたくさん貼りました",
    createdAt: new Date(2026, 0, 5),
  },
  // 2025年12月
  {
    id: "12",
    childId: "riho",
    title: "クリスマスツリー",
    category: "craft",
    imageUrl: "/samples/craft5.svg",
    thumbnailUrl: "/samples/craft5.svg",
    location: "幼稚園",
    date: new Date(2025, 11, 18),
    memo: "キラキラのツリーを作りました",
    createdAt: new Date(2025, 11, 18),
  },
  {
    id: "13",
    childId: "riho",
    title: "サンタさん",
    category: "drawing",
    imageUrl: "/samples/drawing7.svg",
    thumbnailUrl: "/samples/drawing7.svg",
    location: "おうち",
    date: new Date(2025, 11, 24),
    memo: "サンタさんの絵",
    createdAt: new Date(2025, 11, 24),
  },
  {
    id: "14",
    childId: "mitsuki",
    title: "てがたトナカイ",
    category: "craft",
    imageUrl: "/samples/craft6.svg",
    thumbnailUrl: "/samples/craft6.svg",
    location: "おうち",
    date: new Date(2025, 11, 20),
    memo: "手形でトナカイを作りました",
    createdAt: new Date(2025, 11, 20),
  },
  // 2025年11月
  {
    id: "15",
    childId: "riho",
    title: "もみじのえ",
    category: "drawing",
    imageUrl: "/samples/drawing8.svg",
    thumbnailUrl: "/samples/drawing8.svg",
    location: "幼稚園",
    date: new Date(2025, 10, 15),
    memo: "秋の紅葉を描きました",
    createdAt: new Date(2025, 10, 15),
  },
  {
    id: "16",
    childId: "riho",
    title: "おちばアート",
    category: "other",
    imageUrl: "/samples/other2.svg",
    thumbnailUrl: "/samples/other2.svg",
    location: "幼稚園",
    date: new Date(2025, 10, 10),
    memo: "拾った落ち葉で作品を作りました",
    createdAt: new Date(2025, 10, 10),
  },
];

export function getChild(id: string): Child | undefined {
  return children.find((c) => c.id === id);
}

export function getArtwork(id: string): Artwork | undefined {
  return artworks.find((a) => a.id === id);
}

export function getArtworksByMonth(
  year: number,
  month: number
): Artwork[] {
  return artworks.filter((a) => {
    const d = new Date(a.date);
    return d.getFullYear() === year && d.getMonth() + 1 === month;
  });
}
