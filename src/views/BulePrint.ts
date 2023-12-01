interface bpItem {
  name: string;
  path: string;
  date: string;
  tags: string[];
}

const demoBp = [
  {
    name: "slide",
    path: "/demo/001.vue",
    date: "2021-08-20",
    tags: ["css"],
  },
];
const blogBp: bpItem[] = [];
const noteBp: bpItem[] = [];
const projectBp: bpItem[] = [];
export { demoBp, blogBp, noteBp, projectBp };
