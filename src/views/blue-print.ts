/*
 * @Description:
 * @Author: lize
 * @Date: 2023-12-06
 * @LastEditors: lize
 */
import type { bpItem, projectItem } from "@/types";
const demoBp: bpItem[] = [
  {
    name: "intersectionObserver",
    description: "css transition test",
    link: "@/assets/video/intersectionObserver.mp4",
    date: "2021-08-20",
    tags: ["css", "webApi"],
    lang: "cn",
  },
  {
    name: "scrolling",
    description: "css transition test",
    link: "@/assets/video/scrolling.mp4",
    date: "2021-08-20",
    tags: ["css", "webApi"],
    lang: "cn",
  },
  {
    name: "requestAnimationFrame",
    description: "css transition test",
    link: "@/assets/video/requestAnimationFrame.mp4",
    date: "2021-08-20",
    tags: ["css", "webApi"],
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
  {
    name: "More_Effective_c++",
    link: "/note/More_Effective_c++.md",
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
