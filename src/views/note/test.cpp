#include <iostream>
using namespace std;
int *f()
{
    int fx = 9;
    return &fx; // 不好
}

void g(int *p) // 貌似确实是无辜的
{
    int gx;
    cout << "*p == " << *p << '\n';
    *p = 999;
    cout << "gx == " << gx << '\n';
}

void h()
{
    int *p = f();
    int z = *p; // 从已经丢弃的栈帧中读取（不好）
    g(p);       // 把指向已丢弃栈帧的指针传递给函数（不好）
}