export interface bpItem {
  name: string;
  link: string;
  date?: string;
  description?: string;
  tags?: string[];
  lang: string;
}
export interface projectItem extends bpItem {
  icon: string;
}
