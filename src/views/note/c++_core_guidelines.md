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

## 第四章:函数
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
    auto& x = read(cin);
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



// 计算组合数
template <int N, int K>
struct BinomialCoefficient {
    static const int value = BinomialCoefficient<N - 1, K - 1>::value + BinomialCoefficient<N - 1, K>::value;
};

template <int N>
struct BinomialCoefficient<N, 0> {
    static const int value = 1;
};

template <int N>
struct BinomialCoefficient<N, N> {
    static const int value = 1;
};

int main() {
    const int result = BinomialCoefficient<5, 2>::value;  // 在编译期计算组合数 C(5, 2)
    return 0;
}



```

+ F.5 如果函数非常小，并且时间是敏感的，就将其声明为inline
```c++
inline string cat(const string& s, const string& s2) { return s + s2; }

constexpr 蕴含 inline。
在类之中所定义的成员函数默认是 inline 的。
函数模板（包括类模板的成员函数 A<T>::function() 和成员函数模板 A::function<T>()）一般都定义于头文件中，因此是内联的。


```

+ F.6: 如果函数必然不会抛出异常，就将其声明为 noexcept

当一个函数被声明为 noexcept 时，编译器会做出一些优化，以避免异常的处理。这些优化包括省略异常处理代码，减少栈展开操作和其他能够提高程序运行效率的操作。因此，使用 noexcept 可以帮助开发者提高程序的性能和可靠性。


析构函数，swap 函数，移动操作，以及默认构造函数不应当抛出异常 // 存疑?

笔记:谨慎使用

+ F.7: 对于常规用法，应当接受 T* 或 T& 参数而不是智能指针
```c++
智能指针的传递会转移或者共享所有权，因此应当仅在有意要实现所有权语义时才能使用。 不操作生存期的函数应当接受原始指针或引用。

// 被调用方 bad
void f(shared_ptr<widget>& w)
{
    // ...
    use(*w); // w 的唯一使用点 -- 其生存期是完全未被涉及到的
    // ...
};

// 调用方
shared_ptr<widget> my_widget = /* ... */;
f(my_widget);

widget stack_widget;
f(stack_widget); // 错误

// 被调用方 good
void f(widget& w)
{
    // ...
    use(w);
    // ...
};

// 调用方
shared_ptr<widget> my_widget = /* ... */;
f(*my_widget);

widget stack_widget;
f(stack_widget); // ok -- 这样就有效了


实施: 若函数接受可复制的智能指针类型（即重载了 operator-> 或 operator*），但该函数仅调用了：operator*、operator-> 或 get()，则给出警告。 建议代之以 T* 或 T&。
笔记: 引用只是别名，没有任何内存空间。智能指针也要限制，当且仅当关于生存期相关时才使用
```
+ F.8 优先使用纯函数
```c++
幂等且无副作用
```
+ F.9 未使用的形参应当没有名字
+ F.10: 若操作可被重用，则应为其命名
+ F.11 当需要仅在一处使用的简单函数对象时 使用无名lambda
```c++
例外: 为lambda命名有助于明晰代码,即便仅使用一次
```
### 参数传递语义的规则
+ 优先使用简单的和传统的信息传递方式 重要! 
```c++
void f1(const string& s);  // OK: 按 const 引用传递; 总是廉价的
void f2(string s);         // bad: 可能是昂贵的
void f3(int x);            // OK: 无可比拟
void f4(const int& x);     // bad: f4() 中的访问带来开销

（仅）对于高级的运用，如果你确实需要为“只当作输入”的参数的按右值传递进行优化的话：
             
如果函数需要无条件地从参数进行移动，那就按 && 来接受参数。参见 F.18。
如果函数需要保留参数的一个副本，那就在按 const& 接受参数（对于左值）之外， 添加一个按 && 传递参数（对于右值）的重载，并在函数体中将之 std::move 到其目标之中。基本上，这个重载是“将被移动（will-move-from）”；参见 F.18。
在特殊情况中，比如有多个“输入+复制”的参数时，考虑采用完美转发

强制实施
【简单】〔基础〕 当按值传递的参数的大小大于 2 * sizeof(void*) 时给出警告。 建议代之以 const 的引用。
【简单】〔基础〕 当按 const 引用传递的参数的大小小于或等于 2 * sizeof(void*) 时给出警告。建议代之以按值传递。
【简单】〔基础〕 当按 const 引用传递的参数被 move 时给出警告。

```
+ F.17 对于“输入/输出（in-out）”参数，按非 const 引用进行传递
```c++
void update(Record& r);  // 假定 update 将会写入 r
左值右值:https://zhuanlan.zhihu.com/p/107445960
```
+ F.18 对于将被移动参数，按x&&进行传递并对参数std::move
```c++
X&& 绑定到右值，而要传递左值的话则要求在调用点明确进行 std::move。

void sink(vector<int>&& v)  // 无论参数所拥有的是什么，sink 都获得了其所有权
{
    // 通常这里可能有对 v 的 const 访问
    store_somewhere(std::move(v));
    // 通常这里不再会使用 v 了；它已经被移走
}
```
+ F.19 对于转发参数 按TP&&进行传递并只对参数std::forward
```c++
template<class F, class... Args>
inline auto invoke(F f, Args&&... args)
{
    return f(forward<Args>(args)...);
}
```
+ F.20 对于输出值，采用返回值优先于输出参数
```c++
// OK: 返回指向具有 x 值的元素的指针
vector<const int*> find_all(const vector<int>&, int x);

// 不好: 把指向具有 x 值的元素的指针放入 out
void find_all(const vector<int>&, vector<const int*>& out, int x);
```

+ F.21: 要返回多个“输出”值，优先返回结构体或元组（tuple）
```c++
Sometype iter;                                // 如果我们还未因为别的目的而使用
Someothertype success;                        // 这些变量，则进行默认初始化

tie(iter, success) = my_set.insert("Hello");   // 普通的返回值
if (success) do_something_with(iter);

// c++17
if (auto [ iter, success ] = my_set.insert("Hello"); success) do_something_with(iter);


// 不好: 在代码注释作用说明仅作输出的参数
int f(const string& input, /*output only*/ string& output_data)
{
    // ...
    output_data = something();
    return status;
}

// 好: 自我说明的
tuple<int, string> f(const string& input)
{
    // ...
    return {status, something()};
}
```

F.60: 当“没有参数”是有效的选项时，采用 T* 优先于 T&
+ F.22: 用 T*，owner<T*> 或者智能指针来代表一个对象
```c++
在传统的 C 和 C++ 代码中，普通的 T* 有各种互相没什么关联的用法，比如：

标识单个对象（本函数内不会进行 delete）
指向分配于自由存储之中的一个对象（随后将会 delete）
持有 nullptr 值
标识一个 C 风格字符串（以零结尾的字符数组）
标识一个数组，其长度被分开指明
标识数组中的一个位置
这样就难于了解代码真正做了什么和打算做什么。 它也会使检查工作和工具支持复杂化。

void use(int* p, int n, char* s, int* q)
{
    p[n - 1] = 666; // 不好: 不知道 p 是不是指向了 n 个元素；
                    // 应当假定它并非如此，否则应当使用 span<int>
    cout << s;      // 不好: 不知道 s 指向的是不是以零结尾的字符数组；
                    // 应当假定它并非如此，否则应当使用 zstring
    delete q;       // 不好: 不知道 *q 是不是在自由存储中分配的；
                    // 否则应当使用 owner
}

void use2(span<int> p, zstring s, owner<int*> q)
{
    p[p.size() - 1] = 666; // OK, 会造成范围错误
    cout << s; // OK
    delete q;  // OK
}
```

+ F.23: 用 not_null<T> 来表明“空值（null）”不是有效的值
```c++
// 确保 p != nullptr 是调用者的任务
int length(not_null<Record*> p);

// length() 的实现者必须假定可能出现 p == nullptr
int length(Record* p);
```
+ F.24 用span<T>表示半开序列
```c++
X* find(span<X> r, const X& v);    // 在 r 中寻找 v

vector<X> vec;
// ...
auto p = find({ve+ c.begin(), ve+ c.end()}, X{});  // 在 vec 中寻找 X{}
```

+ F.25: 用 zstring 或者 not_null<zstring> 来代表 C 风格的字符串
```c++
当不需要零结尾时，请使用 'string_view'。
```
+ F.26: 当需要指针时，用 unique_ptr<T> 来传递所有权
```c++
unique_ptr<Shape> get_shape(istream& is)  // 从输入流中装配一个形状
{
    auto kind = read_header(is); // 从输入中读取头部并识别下一个形状
    switch (kind) {
    case kCircle:
        return make_unique<Circle>(is);
    case kTriangle:
        return make_unique<Triangle>(is);
    // ...
    }
}
```
+ F.27 用 shared_ptr<T> 来共享所有权
```c++
使用 std::shared_ptr 是表示共享所有权的标准方式。其含义是，最后一个拥有者负责删除对象。


shared_ptr<const Image> im { read_image(somewhere) };

std::thread t0 {shade, args0, top_left, im};
std::thread t1 {shade, args1, top_right, im};
std::thread t2 {shade, args2, bottom_left, im};
std::thread t3 {shade, args3, bottom_right, im};

// 脱离各线程
// 最后执行完的线程会删除这个图像
```

### 值返回语义的规则
+ F.42: 返回 T* 来（仅仅）给出一个位置
```c++
Node* find(Node* t, const string& s)  // 在 Node 组成的二叉树中寻找 s
{
    if (!t || t->name == s) return t;
    if ((auto p = find(t->left, s))) return p;
    if ((auto p = find(t->right, s))) return p;
    return nullptr;
}
find 所返回的指针如果不是 nullptr 的话，就指定了一个含有 s 的 Node。 重要的是，这里面并没有暗含着把所指向的对象的所有权传递给调用者。
不要返回指向某个不在调用方的作用域中的东西的指针

疑问：为什么不用unique_ptr?
```
+ F.43: 不要（直接或间接）返回指向局部对象的指针或引用
```c++
幸运的是，大多数（全部？）的当代编译器都可以识别这种简单的情况并给出警告。
```
+ F.44: 当不想进行复制，而“没有对象被返回”不是有效的选项时，返回 T&
```c++
它要求返回对已销毁的临时对象的引用。

对除了 std::move 和 std::forward 之外的任何把 && 作为返回类型的情况都进行标记。

```
+ F.46: int 是 main() 的返回类型
+ F.47: 赋值运算符返回 T&
```c++
class MyClass {
    MyClass& operator+(const MyClass& rhs);
}
```
+ F.48: 不要用 return std::move(local)
+ F.49: 不要返回 const T
```c++
const vector<int> fct();    // 不好: 这个 "const" 带来的麻烦超过其价值

void g(vector<int>& vx)
{
    // ...
    fct() = vx;   // 被 "const" 所禁止
    // ...
    vx = fct(); // 昂贵的复制："const" 抑制掉了移动语义
    // ...
}
```

### 其他函数规则
+ F.50 当函数不适用时（不能俘获局部变量，或者不能编写局部函数），就使用 Lambda
+ F.51: 如果需要作出选择，采用默认实参应当优先于进行重载
+ F.52: 对于局部使用的（也包括传递给算法的）lambda，优先采用按引用俘获
```c++
void send_packets(buffers& bufs)
{
    stage encryptor([](buffer& b) { encrypt(b); });
    stage compressor([&](buffer& b) { compress(b); encryptor.process(b); });
    stage decorator([&](buffer& b) { decorate(b); compressor.process(b); });
    for (auto& b : bufs) { decorator.process(b); }
}  // 自动阻塞以等待管线完成
```
+ F.53: 对于非局部使用的（包括被返回的，在堆上存储的，或者传递给别的线程的）lambda，避免采用按引用俘获
```c++
如果必须捕获非局部指针，则应考虑使用 unique_ptr；它会处理生存期和同步问题。

如果必须捕获 this 指针，则应考虑使用 [*this] 捕获，它会创建整个对象的一个副本。
```

F.54: 当俘获了 this 时，显式俘获所有的变量（不使用默认俘获）
```c++
class My_class {
    int x = 0;
    // ...

    void f()
    {
        int i = 0;
        // ...

        auto lambda = [=] { use(i, x); };   // 不好: “貌似”按复制/按值俘获
        // [&] 在当前的语言规则下的语义是一样的，也会复制 this 指针
        // [=,this] 和 [&,this] 也没好多少，并且也会导致混淆

        x = 42;
        lambda(); // 调用 use(0, 42);
        x = 43;
        lambda(); // 调用 use(0, 43);

        // ...

        auto lambda2 = [i, this] { use(i, x); }; // ok, 最明确并且最不混淆

        // ...
    }
};
```
+ F.55: 不要使用 va_arg 参数
```c++
int sum(...)
{
    // ...
    while (/*...*/)
        result += va_arg(list, int); // 不好，假定所传递的是 int
    // ...
}

sum(3, 2); // ok
sum(3.14159, 2.71828); // 不好，未定义的行为

template<class ...Args>
auto sum(Args... args) // 好，而且更灵活
{
    return (... + args); // 注意：C++17 的“折叠表达式”
}

sum(3, 2); // ok: 5
sum(3.14159, 2.71828); // ok: ~5.85987
折叠表达式: https://zhuanlan.zhihu.com/p/670871464 


template<typename First, typename... Rest>
First sum2(First&& first, Rest&&... rest)
{
    return (first + ... + rest);  // 二元左折叠
}

template<typename... Ts>
void printAll(Ts&&... mXs)
{
    (cout << ... << mXs) << endl; // 二元左折叠
}
printAll(3, 4.0, "5")
= (cout << ... << pack(3, 4.0, "5")) << endl
= ((cout << 3) << 4.0) << "5" << endl
= 打印345并换行

```
+ F.56: 避免不必要的条件嵌套
```c++
错误直接返回
```

## 第五章 类和类层次
+ C.1: 把相关的数据组织到结构中（struct 或 class）
+ C.2: 当类具有不变式时使用 class；当数据成员可以独立进行变动时使用 struct
+ C.3: 用类来表示接口和实现之间的区别
+ C.4: 仅当函数直接访问类的内部表示时才让函数作为其成员
+ C.5: 把辅助函数放在其所支持的类相同的命名空间之中
```c++
辅助函数是（由类的作者提供的）并不需要直接访问类的内部表示的函数，它们也被当作是类的可用接口的一部分。
namespace Chrono { // 我们在这里放置与时间有关的服务

    class Time { /* ... */ };
    class Date { /* ... */ };

    // 辅助函数:
    bool operator==(Date, Date);
    Date next_weekday(Date);
    // ...
}
```
+ C.7: 不要在同一个语句中同时定义类或枚举并声明该类型的变量
```c++
struct Data { /*...*/ } data{ /*...*/ };
struct Data { /*...*/ };
Data data{ /*...*/ };
```
+ C.8: 当有任何非公开成员时使用 class 而不是 struct
+ C.9: 让成员的暴露最小化
```c++
封装。 信息隐藏。 使发生意外访问的机会最小化。 这会简化维护工作。
```

+ C.10:优先使用具体类型而不是类继承层次
```c++
对于运行时多态接口来说，使用间接是一项基本要求。 而分配/回收操作的开销则不是（它们只是最常见的情况而已）。 我们可以使用基类来作为有作用域的派生类对象的接口。 当禁止使用动态分配时（比如硬实时）就可以这样做，为某些种类的插件提供一种稳定的接口。 没懂?
```

+ C.11: 使具体类型正规化
+ C.12: 不要令可复制或移动类型的数据成员为 const 或引用
```c++
如果需要一个指向某物的成员，就请使用指针（原始的或智能的，而当它不能为 null 时使用 gsl::not_null）而不是引用。
```
### 默认操作
C.20 只要可能 请避免定义任意的默认操作
```c++
A()
A(const A&)
A(A&&)
operator==(const A&)
operator==(A&&)
~A()

the rule of zero: 
具有自定义析构函数、复制/移动构造函数或复制/移动赋值运算符的类应专门处理所有权（遵循单一职责原则）。其他类不应具有自定义析构函数、复制/移动构造函数或复制/移动赋值运算符 [1] 。
class rule_of_zero
{
    std::string cppstring;
public:
    rule_of_zero(const std::string& arg) : cppstring(arg) {}
};



the rule of three:
如果一个类需要用户定义的析构函数、用户定义的复制构造函数或用户定义的复制赋值运算符，那么它几乎肯定需要这三个函数。
```

C.21: 如果定义或者 =delete 了任何复制、移动或析构函数，请定义或者 =delete 它们全部(重要)
```c++
只要声明了复制，移动或析构函数. 即便是声明为 =default 或 =delete，也将会抑制掉 移动构造函数和移动赋值运算符的隐式声明。
而声明移动构造函数或移动赋值运算符， 即便是声明为 =default 或 =delete，也将会导致隐式生成的复制构造函数 或隐式生成的复制赋值运算符被定义为弃置的。
因此，只要声明了它们中的任何一个，就应当将 其他全部都予以声明，以避免出现预期外的效果，比如将所有潜在的移动 都变成了更昂贵的复制操作，或者使类变为只能移动的。

the rule of five:
 因为用户定义的（或=默认或=删除声明）析构函数、复制构造函数或复制赋值运算符的存在阻止了移动构造函数和移动赋值运算符的隐式定义，任何需要移动语义的类，必须声明所有五个特殊成员函数：
```

C.22: 使默认操作之间保持一致
```c++
如果拷贝构造是浅拷贝 那么拷贝赋值也是浅拷贝
```
### 析构函数
“这个类需要析构函数吗？”是一个出人意料有洞察力的设计问题。 对于大多数类来说，答案是“不需要”，

C.30: 如果一个类需要在对象销毁时执行明确的操作，请为其定义析构函数
C.31: 类所获取的所有资源，必须都在类的析构函数中进行释放
```c++
对于以具有完整的默认操作集合的类来表示的资源来说，这些都是会自动发生的。
class X {
    ifstream f;   // 可能会拥有某个文件
    // ... 没有任何定义或者声明为 =deleted 的默认操作 ...
};

class X2 {     // 不好
    FILE* f;   // 可能会拥有某个文件
    // ... 没有任何定义或者声明为 =deleted 的默认操作 ...
};
```
C.32: 如果类中带有原始指针（T*）或者引用（T&），请考虑它是否是所有者
C.33: 如果类中带有所有权的指针成员，请定义析构函数
```c++
template<typename T>
class Smart_ptr2 {
    T* p;   // 不好: *p 的所有权含糊不清
    // ...
public:
    // ... 没有自定义的复制操作 ...
    ~Smart_ptr2() { delete p; }  // p 是所有者！
};

void use(Smart_ptr2<int> p1)
{
    auto p2 = p1;   // 错误: 双重删除
}
通常最简单的处理析构函数的方式，就是把指针换成一个智能指针（比如 std::unique_ptr），并让编译器来安排进行恰当的隐式销毁过程。
```
C.35: 基类的析构函数应当要么是 public 和 virtual，要么是 protected 且非 virtual
```c++
如果析构函数是Public的，而非virtual，析构基类指针是未定义行为，可能会仅析构基类，造成派生类对象的内存泄露
struct Base {  // 不好: 隐含带有 public 的非 virtual 析构函数
    virtual void f();
};

struct D : Base {
    string s {"a resource needing cleanup"};
    ~D() { /* ... do some cleanup ... */ }
    // ...
};

void use()
{
    unique_ptr<Base> p = make_unique<D>();
    // ...
} // p 的销毁调用了 ~Base() 而不是 ~D()，这导致 D::s 的泄漏，也许不止
protected且非virtual 没懂

析构函数必须是非私有的，否则它会妨碍使用这个类型：

```
C.36: 析构函数不能失败
```c++

把析构函数声明为 noexcept。这将确保它要么正常完成执行，要么就终止程序。
```
C.37: 使析构函数 noexcept
### 构造函数
C.40: 如果类具有不变式，请为其定义构造函数
C.41: 构造函数应当创建经过完整初始化的对象
```c++
如果无法方便地通过构造函数来构造有效的对象的话，请使用工厂函数。
如果构造函数（为创建有效的对象）获取了某个资源，则这个资源应当由析构函数释放。 这种以构造函数获取资源并以析构函数来释放的惯用法被称为 RAII（“资源获取即初始化/Resource Acquisition Is Initialization”）。
```
C.42: 当构造函数无法构造有效对象时，应当抛出异常
```c++
class X2 {
    FILE* f;
    // ...
public:
    X2(const string& name)
        :f{fopen(name.c_str(), "r")}
    {
        if (!f) throw runtime_error{"could not open" + name};
        // ...
    }

    void read();      // 从 f 中读取数据
    // ...
};

void f()
{
    X2 file {"Zeno"}; // 当文件打不开时会抛出异常
    file.read();      // 好的
    // ...
}

人们使用 init() 函数而不是在构造函数中进行初始化的一种原因是为了避免代码重复。 委派构造函数和默认成员初始化式可以更好地做到这点。
```
C.43: 保证可复制类带有默认构造函数
```c++
许多的语言和程序库设施都依赖于默认构造函数来初始化其各个元素，比如 T a[10] 和 std::vector<T> v(10)。 
注解：
静态分配的内建类型对象被默认初始化为 0，但局部的内建变量并非如此。
缺乏合理的默认构造的类，通常也都不是可以复制的，
例如，基类不能进行复制，且因而并不需要一个默认构造函数：
必须在构造过程中获取由调用方提供的资源的类，通常无法提供默认构造函数，
```
C.44: 尽量让默认构造函数简单且不抛出异常
```c++
// bad
template<typename T>
// elem 指向以 new 分配的 space-elem 个元素
class Vector0 {
public:
    Vector0() :Vector0{0} {}
    Vector0(int n) :elem{new T[n]}, space{elem + n}, last{elem} {}
    // ...
private:
    own<T*> elem;
    T* space;
    T* last;
};
这段代码很不错而且通用，不过在发生错误之后把一个 Vector0 进行置空会涉及一次分配，而它是可能失败的。 而且把默认的 Vector 表示为 {new T[0], 0, 0} 也比较浪费。 比如说，Vector0<int> v[100] 会耗费 100 次分配操作。
```

C.45: 不要定义仅对数据成员进行初始化的默认构造函数；应当使用成员初始化式
```c++
class X1 { // 不好: 未使用成员初始化式
    string s;
    int i;
public:
    X1() :s{"default"}, i{1} { }
    // ...
};

class X2 {
    string s {"default"};
    int i {1};
public:
    // 使用编译期生成的默认构造函数
    // ...
};
```

C.46: 默认情况下，把单参数的构造函数声明为 explicit
```c++
class String {
public:
    String(int);   // 不好
    // ...
};

String s = 10;   // 意外: 大小为 10 的字符串
```
C.47: 按成员声明的顺序对成员变量进行定义和初始化
```c++
class Foo {
    int m1;
    int m2;
public:
    Foo(int x) :m2{x}, m1{++x} { }   // 不好: 有误导性的初始化式顺序
    // ...
};

Foo x(1); // 意外: x.m1 == x.m2 == 2
```
C.48: 对于常量初始化式来说，优先采用类中的初始化式而不是构造函数中的成员初始化式
C.49: 优先进行初始化而不是在构造函数中赋值
C.50: 当初始化过程中需要体现“虚函数行为”时，请使用工厂函数
```c++
没懂 如果不用呢? 有什么后果
```
C.51: 用委派构造函数来表示类中所有构造函数的共同行为
C.52: 使用继承构造函数来把构造函数引入到无须进行其他的明确初始化操作的派生类之中
```c++
没懂
```
C.60: 使复制赋值非 virtual，接受 const& 的参数，并返回非 const 的引用
```c++
class F {
    F& operator=(const F& other){
        auto tmp = other;
        swap(*this, tmp);
        return *this
    }
}
```
C.61: 复制操作应当进行复制
```c++
应当优先采用值语义，除非你要构建某种“智能指针”。值语义是最容易进行推理的，而且也是被标准库设施所期望的。
```
C.62: 使复制赋值可以安全进行自赋值
```c++
从可以处理自赋值的成员所生成的默认复制操作是能够正确处理自赋值的。

struct Bar {
    vector<pair<int, int>> v;
    map<string, int> m;
    string s;
};

Bar b;
// ...
b = b;   // 正确而且高效
```
C.63: 使移动赋值非 virtual，接受 && 的参数，并返回非 const&
C.64: 移动操作应当进行移动，并使原对象处于有效状态
```c++
执行 y=std::move(x) 之后，y 的值应当为 x 曾经的值，而 x 应当处于有效状态。
class X {   // OK: 值语义
public:
    X();
    X(X&& a) noexcept;  // 移动 X
    X& operator=(X&& a) noexcept; // 移动赋值 X
    void modify();     // 改变 X 的值
    // ...
    ~X() { delete[] p; }
private:
    T* p;
    int sz;
};

X::X(X&& a) noexcept
    :p{a.p}, sz{a.sz}  // 窃取其表示
{
    a.p = nullptr;     // 设其为“空”
    a.sz = 0;
}

void use()
{
    X x{};
    // ...
    X y = std::move(x);
    x = X{};   // OK
} // OK: x 可以销毁

理想情况下，被移走的对象应当为类型的默认值。 请确保体现这点，除非有非常好的理由不这样做。 然而，并非所有类型都有默认值，而有些类型建立默认值则是昂贵操作。 标准所要求的仅仅是被移走的对象应当可以被销毁。 我们通常也可以轻易且廉价地做得更好一些：标准库假定它可以向被移走的对象进行赋值。 请保证总是让被移走的对象处于某种（需要明确的）有效状态。
```
C.65: 使移动赋值可以安全进行自赋值
C.66: 使移动操作 noexcept
C.67: 多态类应当抑制公开的移动/复制操作
```c++
基类最好delete复制/移动操作
多态类是定义或继承了至少一个虚函数的类。它很可能要被用作其他具有多态行为的派生类的基类。如果不小心将其按值传递了，如果它带有隐式生成的复制构造函数和赋值的话，它就面临发生切片的风险：只会复制派生类对象的基类部分，但将损坏其多态行为。
class B { // 不好: 多态基类并未抑制复制操作
public:
    virtual char m() { return 'B'; }
    // ... 没有提供复制操作，使用预置实现 ...
};

class D : public B {
public:
    char m() override { return 'D'; }
    // ...
};

void f(B& b)
{
    auto b2 = b; // 啊呀，对象切片了；b2.m() 将返回 'B'
}

D d;
f(d);
```
### 默认操作的其他规则
C.80: 当需要明确使用缺省语义时，使用 =default
C.81: 当需要关闭缺省行为（且不需要替代的行为）时，使用 =delete
C.82: 不要在构造函数和析构函数中调用虚函数
```c++
其中所调用的函数其实是目前所构造的对象的函数，而不是可能在派生类中覆盖它的函数。 这可能是最易混淆的。 更糟的是，从构造函数或析构函数中直接或间接调用未被实现的纯虚函数的话，还会导致未定义的行为。
没懂
```
C.83: 考虑为值类型提供 noexcept 的 swap 函数
```c++
class Foo {
public:
    void swap(Foo& rhs) noexcept
    {
        m1.swap(rhs.m1);
        std::swap(m2, rhs.m2);
    }
private:
    Bar m1;
    int m2;
};

为调用者方便起见，可以在类型所在的相同命名空间中提供一个非成员的 swap 函数。
void swap(Foo& a, Foo& b)
{
    a.swap(b);
}
```
C.84: swap 函数不能失败
C.85: 使 swap 函数 noexcept
C.86: 使 == 对操作数的类型对称，并使之 noexcept
```c++
// good
struct X {
    string name;
    int number;
};

bool operator==(const X& a, const X& b) noexcept {
    return a.name == b.name && a.number == b.number;
}
// bad 
class B {
    string name;
    int number;
    bool operator==(const B& a) const {
        return name == a.name && number == a.number;
    }
    // ...
};
B 的比较函数接受其第二个操作数上的类型转换，但第一个操作数不可以。
C.87: 请当心基类的 ==
C.89: 使 hash 函数 noexcept 
```c++
不懂
```
C.90: 依靠构造函数和赋值运算符，不要依靠 memset 和 memcpy

```

### 容器和其他资源包装类
C.100: 定义容器的时候要遵循 STL
```c++
// 简化版本（比如没有分配器）：

template<typename T>
class Sorted_vector {
    using value_type = T;
    // ... 各迭代器类型 ...

    Sorted_vector() = default;
    Sorted_vector(initializer_list<T>);    // 初始化式列表构造函数：进行排序并存储
    Sorted_vector(const Sorted_vector&) = default;
    Sorted_vector(Sorted_vector&&) noexcept = default;
    Sorted_vector& operator=(const Sorted_vector&) = default;     // 复制赋值
    Sorted_vector& operator=(Sorted_vector&&) noexcept = default; // 移动赋值
    ~Sorted_vector() = default;

    Sorted_vector(const std::vector<T>& v);   // 存储并排序
    Sorted_vector(std::vector<T>&& v);        // 排序并“窃取表示”

    const T& operator[](int i) const { return rep[i]; }
    // 不提供非 const 的直接访问，以维持顺序

    void push_back(const T&);   // 在正确位置插入（不一定在末尾）
    void push_back(T&&);        // 在正确位置插入（不一定在末尾）

    // ... cbegin(), cend() ...
private:
    std::vector<T> rep;  // 用一个 std::vector 来持有各元素
};

template<typename T> bool operator==(const Sorted_vector<T>&, const Sorted_vector<T>&);
template<typename T> bool operator!=(const Sorted_vector<T>&, const Sorted_vector<T>&);
// ...
```
C.101: 为容器提供值语义
C.102: 为容器提供移动操作
C.103: 为容器提供一个初始化式列表构造函数
C.104: 为容器提供一个将之置空的默认构造函数
C.109: 当资源包装类具有指针语义时，应提供 * 和 ->

### 函数对象和 lambda
### 类层次（OOP）
#### 类层次规则概览：
C.120: 使用类层次来表达具有天然层次化结构的概念
```c++
当单纯使用数据成员就能搞定时请不要使用继承。
```
C.121: 如果基类被用作接口的话，应使其成为纯抽象类
```c++
class Goof {
public:
    // ... 只有一个纯虚函数 ...
    // 没有虚析构函数
};

class Derived : public Goof {
    string s;
    // ...
};

void use()
{
    unique_ptr<Goof> p {new Derived{"here we go"}};
    f(p.get()); // 通过 Goof 接口使用 Derived
    g(p.get()); // 通过 Goof 接口使用 Derived
} // 泄漏
```
C.122: 当需要完全区分接口和实现时，应当用抽象类作为接口
```c++
接口是接口，实现是实现。这就是继承。
struct Device {
    virtual ~Device() = default;
    virtual void write(span<const char> outbuf) = 0;
    virtual void read(span<char> inbuf) = 0;
};

class D1 : public Device {
    // ... 数据 ...

    void write(span<const char> outbuf) override;
    void read(span<char> inbuf) override;
};

class D2 : public Device {
    // ... 不同的数据 ...

    void write(span<const char> outbuf) override;
    void read(span<char> inbuf) override;
};

unique_ptr<Device> = new D2()
```
#### 类层次的设计规则概览：
C.126: 抽象类通常并不需要用户编写的构造函数
```c++
通常抽象类并没有任何需要由构造函数来初始化的对象。
例外:有任务的基类构造函数，比如把对象注册到什么地方的时候，可能是需要构造函数的。

```
C.127: 带有虚函数的类应当带有虚的或受保护的析构函数
```c++
带有虚函数的类通常是通过指向基类的指针来使用的。一般来说，最后一个使用者必须在基类指针上执行 delete，这常常是通过基类智能指针来做到的，因而析构函数应当为 public 和 virtual。
重要:
struct B {
    virtual int f() = 0;
    // ... 没有用户编写的析构函数，缺省为 public 非 virtual ...
};

// 不好：继承于没有虚析构函数的类
struct D : B {
    string s {"default"};
    // ...
};

void use()
{
    unique_ptr<B> p = make_unique<D>();
    // ...
} // 未定义行为。可能仅仅调用了 B::~B 而字符串则被泄漏了
```


有些人不遵守本条规则，因为他们打算仅通过 shared_ptr 来使用这些类：std::shared_ptr<B> p = std::make_shared<D>(args); 这种情况下，由共享指针来负责删除对象，因此并不会发生不适当的基类 delete 所导致的泄漏。坚持一贯这样做的人可能会得到假阳性的警告，但这条规则其实很重要——当通过 make_unique 分配对象时会如何呢？这样的话是不安全的，除非 B 的作者保证它不会被误用，比如可以让所有的构造函数为私有的并提供一个工厂函数，来强制保证分配都是通过 make_shared 进行。


C.128: 虚函数应当指明 virtual、override、final 三者之一
```c++
virtual 刚好仅仅表明“这是一个新的虚函数”。
override 刚好仅仅表明“这是一个非最终覆盖函数”。
final 刚好仅仅表明“这是一个最终覆盖函数”
```
C.129: 当设计类层次时，应区分实现继承和接口继承
#### 对类层次中的对象进行访问的规则概览：