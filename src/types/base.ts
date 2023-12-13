/*
 * @Description:
 * @Author: lize
 * @Date: 2023-12-11
 * @LastEditors: lize
 */
export interface bpItem {
  name: string;
  link: string;
  date?: string;
  description?: string;
  tags?: string[];
  source?: string;
  lang: string;
}
export interface projectItem extends bpItem {
  icon: string;
}
