<!--
 * @Description: 
 * @Author: lize
 * @Date: 2023-12-08
 * @LastEditors: lize
-->
# C++ CoreGuidelines

## 第二章:理念

理念规则强调一般性，为后面规则提供理论依据

+ 在代码中直接表达思想(可读性)

> 代码所表达的东西必须有**明确的语义**，并且可以使用编译器和其他工具检测

    1. 一个成员函数是否使用const修饰。
    2. 避免显示循环，尽可能使用stl库。
    3. int/month

+ 使用ISO标准

> 使用当前的c++标准 而不是编译器实现。

    1. 未定义行为(Undefined Behavior): 越界 访问空指针
    2. 实现定义行为(mplementation Defined Behavior)： sizeof(int) a>>1

+ 表达意图

```c++

for (const auto& v: vec) {...}                              // (1)
for (auto& v: vec) {...}                                    // (2)
std::for_each(std::execution::par, vec, [](auto v) {...});  // (3) 很抽象，这种形式其实根本做不到，当伪代码就好

```

+ 理想情况下，程序应该是静态类型安全的
+ 编译期检查优先于运行期检查
+ 不能在编译期检查的事项应该在运行期检查
+ 不要泄露任何资源

> RAII: 构造函数获取资源，析构函数释放资源

+ 不要浪费时间和空间

> 移动语义，移动对象及其成员函数

+ 如果可以为常量，那就把它设置为常量
+ 封装杂乱的构建

## 第三章:接口

+ 避免非const的全局变量
    
    1. 破坏了封装，无法测试
    2. 并发时需要保护
    
```c++
int glob{ 2011 };

int multiply(int fac){
    glob *= glob;
    return glob * fac;
}
```

> 尽可能避免使用单例，静态初始化的顺序未定义!

+ 依赖注入而不是单例
+ 使接口严格和强类型化
    1. 利用模板形参可以把 void* 排除而改为 T* 或者 T&。 
    2. 各参数类型及其值并不能表明其所指定的设置项是什么以及它们的值所代表的含义。
    
```c++
draw_rect(100, 200, 100, 500); // bad
draw_rectangle(p, Point{10, 20});  // good
draw_rectangle(p, Size{10, 20});   // good

enable_lamp_options(lamp_option::on | lamp_option::animate_state_transitions); //good

alarm_settings s{};
s.enabled = true;
s.displayMode = alarm_settings::mode::spinning_light; // good
s.frequency = alarm_settings::every_10_seconds; // good
set_settings(s);


void blink_led(int time_to_blink) // 不好 -- 在单位上含糊
void blink_led(milliseconds time_to_blink) // 好 -- 单位明确

```

+  优先使用 Expects() 来表达前条件
```c++
int area(int height, int width)
{
    Expects(height > 0 && width > 0);            // 好
    if (height <= 0 || width <= 0) my_error();   // 隐晦的
    // ...
}
```
+ 说明后条件
```c++
int area(int height, int width) { return height * width; }  // 不好

int area(int height, int width)  // 好的
{
    auto res = height * width;
    Ensures(res > 0);
    return res;
}


void manipulate(Record& r)    // bad
{
    m.lock();
    // ... 没有 m.unlock() ...
}

void manipulate(Record& r)    // good
{
    lock_guard<mutex> _ {m};
    // ...
}

```

+ 决不以原始指针（T*）或引用（T&）来传递所有权
```c++
X* compute(args)    // 请勿这样做
{
    X* res = new X{};
    // ...
    return res;
}


vector<double> compute(args)  // 好的
{
    vector<double> res(10000);
    // ...
    return res;
}

unique_ptr<X> compute(args)    // 好的
{
    X* res = new X{};
    // ...
    return make_unique<X>(res);
}


```

+ 把不能为空的指针声明为null

```c++
const func1(const char* p) {} // 不知道p是否可为nullptr
const func1(not_null<const char*> p) {} // p一定不为空
 `not_null` 在[指导方针支持库](#gsl-guidelines-support-library)中定义。
```

+  不要只用一个指针来传递数组

(pointer, size) 式的接口是易于出错的。同样，（指向数组的）普通指针还必须依赖某种约定以使被调用方来确定其大小。
```c++
void copy_n(const T* p, T* q, int n); // 从 [p:p+n) 复制到 [q:q+n)
void copy(span<const T> r,span<const T> r2)  //good

```

+ 避免全局对象之间进行复杂的初始化
+ 保持较少的函数参数数量
```c++
方式: 抽象参数类型([begin,end]=>range),拆分函数

eg1:
void f(int* some_ints, int some_ints_length);  // 不好：C 风格，不安全
void f(gsl::span<int> some_ints);              // 好：安全，有边界检查
```


+ 避免可以由同一组实参以不同顺序调用造成不同含义的相邻形参
```c++
void copy_n(T* p, T* q, int n);  // 从 [p:p + n) 复制到 [q:q + n) 容易搞反
void copy_n(const T* p, T* q, int n);  // 从 [p:p + n) 复制到 [q:q + n) 
// 顺序无关的无所谓

笔记: 严谨但有必要嘛？ 

```

+ 优先以空抽象类作为类层次的接口理由
```c++
笔记: 不太赞同，抽象类应该会有公共的数据成员吧？
```
+ 当想要跨编译器的 ABI 时，使用一个 C 风格的语言子集
```c++
笔记: 没接触过 不知道
```


+ PImpl(编译防火墙)
```c++
由于私有数据成员参与类的内存布局，而私有成员函数参与重载决议， 对这些实现细节的改动都要求使用了这类的所有用户全部重新编译。而持有指向实现的指针（Pimpl）的 非多态的接口类，则可以将类的用户从其实现的改变隔离开来，其代价是一层间接。

// widget.h
class widget {
    class impl;
    std::unique_ptr<impl> pimpl;
public:
    void draw(); // 公开 API 转发给实现
    widget(int); // 定义于实现文件中
    ~widget();   // 定义于实现文件中，其中 impl 将为完整类型
    widget(widget&&) noexcept; // 定义于实现文件中
    widget(const widget&) = delete;
    widget& operator=(widget&&) noexcept; // 定义于实现文件中
    widget& operator=(const widget&) = delete;
};

// widget.cpp
class widget::impl {
    int n; // private data
public:
    void draw(const widget& w) { /* ... */ }
    impl(int n) : n(n) {}
};
void widget::draw() { pimpl->draw(*this); }
widget::widget(int n) : pimpl{std::make_unique<impl>(n)} {}
widget::widget(widget&&) noexcept = default;
widget::~widget() = default;
widget& widget::operator=(widget&&) noexcept = default;

笔记: 听起来有一定道理，不过牺牲运行性能交换编译速度总感觉不舒服，但代价不大就是了
```
+ I.30 将有悖规则的部分封装
```c++
bool owned;
owner<istream*> inp;
switch (source) {
case std_in:        owned = false; inp = &cin;                       break;
case command_line:  owned = true;  inp = new istringstream{argv[2]}; break;
case file:          owned = true;  inp = new ifstream{argv[2]};      break;
}
istream& in = *inp;

if (owned) delete inp; // bad 因为我们不得不在某个地方写 



class Istream { [[gsl::suppress(lifetime)]] // 告诉工具在静态检查时忽略生命周期
public:
    enum Opt { from_line = 1 };
    Istream() { }
    Istream(zstring p) : owned{true}, inp{new ifstream{p}} {}            // 从文件读取
    Istream(zstring p, Opt) : owned{true}, inp{new istringstream{p}} {}  // 从命令行读取
    ~Istream() { if (owned) delete inp; }
    operator istream& () { return *inp; }
private:
    bool owned = false;
    istream* inp = &cin;
}; 

笔记: RAII 
```

## 函数
### 函数定义式规则
+ F.1: 把有意义的操作“打包”成为精心命名的函数
```c++
auto lessT = [](T x, T y) { return x.rank() < y.rank() && x.value() < y.value(); };
sort(a, b, lessT);

理由: 把公共的代码分解出去，将使代码更易于阅读，更可能被重用
```
+ F.2: 一个函数应当实施单一逻辑操作
```c++
void read_and_print()    // 不好
{
    int x;
    cin >> x;
    // 检查错误
    cout << x << "\n";
}

void read(istream & input){
    int value;
    input >> value
    return value;
}
void write(ostream & output,int value) {
    output << value
}

void read_and_print(){
    auto& x =read(cin);
    write(cout,x);
}
```
### 函数传递表达式的规则
+ F.3 保持函数短小整洁
```c++
一行到五行大小的函数应当被当作是常态。

标记无法“放入一屏”的函数。 一屏有多大？可以试试 60 行，每行 140 个字符；这大致上就是书本页面能够适于阅读的最大值了。

标记过于复杂的函数。多复杂算是过于复杂呢？ 应当用圈复杂度来度量。可以试试“多于 10 个逻辑路径”。一个简单的开关算作一条路径。
```

+ F.4 如果函数可能必须在编译器进行求值，就将其声明为constexpr
```c++

任何可能最终将依赖于高层次的运行时配置或者 业务逻辑的API，都不应当是 constexpr 的。这种定制化是无法 由编译期来求值的，并且依赖于这种 API 的任何 constexpr 函数 也都应当进行重构，或者抛弃掉 constexpr。

笔记:编译期常量，即编译期确定的变量(数组大小，case,模板).为什么要使用编译器常量&模板?

eg1:
 // 在这个例子中 我们需要使用if保证矩阵相乘时的规则
 Matrix operator*(Matrix const& lhs, Matrix const& rhs) {
   if(lhs.getColumnCount() != rhs.getRowCount()) {
     throw OhWeHaveAProblem(); 
   }
   
   // ...
 }

// 使用模板
template<M,N,P>
Matrx<M,P> operator*(Matrx<M,N> const& lhs, Matrx<N,P> const&rhs) {
    // calc
}
 Matrix<1, 2> m12 = /* ... */;
 Matrix<2, 3> m23 = /* ... */;
 auto m13 = m12 * m23; // OK
 auto mX = m23 * m13;  // Compile Error!
```

+ F.5 如果函数非常小，并且时间是敏感的，就将其声明为inline
```c++
inline string cat(const string& s, const string& s2) { return s + s2; }

constexpr 蕴含 inline。
在类之中所定义的成员函数默认是 inline 的。
函数模板（包括类模板的成员函数 A<T>::function() 和成员函数模板 A::function<T>()）一般都定义于头文件中，因此是内联的。


```

F.6: 如果函数必然不会抛出异常，就将其声明为 noexcept
### 参数传递语义的规则
### 值返回语义的规则
### 其他函数规则