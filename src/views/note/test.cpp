/*
 * @Description:
 * @Author: lize
 * @Date: 2023-12-11
 * @LastEditors: lize
 */
#include <iostream>

template <typename T>
void f(T) {}

template <typename T, size_t N>
void f2(T (&arr)[N])
{ // T被推导为const char，N为4，arr引用了局部的数组
}

int main()
{
    int i1(3.14);
    int i2 = 3.14;
}
int main()
{
    f(1);    // int
    f(1.2);  // double
    f(1.f);  // float
    f("乐"); // const char* 并非数组类型，有隐式转换，因为数组没办法拷贝

    // 解决办法，使用数组引用
    f2("乐");
}