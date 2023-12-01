import type { bpItem, projectItem } from "@/types";
const demoBp: bpItem[] = [
  {
    name: "slide",
    description: "css transition test",
    link: "@/assets/video/slide.mp4",
    date: "2021-08-20",
    tags: ["css"],
    lang: "cn",
  },
];
const blogBp: bpItem[] = [
  {
    name: "走出森林-也谈存在主义危机",
    description: "thank you, alen",
    link: "/blog/走出森林-也谈存在主义危机.md",
    date: "2021-08-20",
    tags: ["人生感悟"],
    lang: "cn",
  },
];
const noteBp: bpItem[] = [
  {
    name: "c++20设计模式",
    link: "/note/20设计模式.md",
    date: "2021-08-20",
    tags: ["读书笔记"],
    lang: "cn",
  },
];
const projectBp: projectItem[] = [
  {
    icon: "test",
    name: "test",
    link: "/blog/test",
    lang: "cn",
  },
];
export { demoBp, blogBp, noteBp, projectBp };
