<!--
 * @Description: 
 * @Author: lize
 * @Date: 2023-12-27
 * @LastEditors: lize
-->
# Effective C++
## 第一章 类型推导
### 条款1 理解模板类型推导
```c++
https://zhuanlan.zhihu.com/p/152154499
auto: 编译器需要通过初始化来确定auto 所代表的类型
decltype: 用来在编译时推导出一个表达式的类型

基本用法: 推导
int x =1;
auto y =2;
decltype(x+y) z = 3;
decltype(z)* = &z


https://blog.csdn.net/qq_38216239/article/details/80815142
通用引用:
typename<class T>
void func1(T&&)
1. 必须精确满足T&&这种形式（即使加上const也不行）
2. 类型T必须是通过推断得到的（最常见的就是模板函数参数）

引用折叠: 
T&& & T& && T& & => T& 
T&& && => T&&

完美转发:
typename<class T>
void func1(T&& t) {
    func2(std::forward<T>(t))
}

理解模板类型推导：
template<typename T>
void f(ParamType param);

template<typename T>
void f(const T& param);         //ParamType是const T&

f(expr)
编译器推断T的类型 不仅要根据expr还要依据ParamType的类型

```
1. ParamType是一个指针或引用，但不是通用引用

如果expr的类型是一个引用，忽略引用部分
然后expr的类型与ParamType进行模式匹配来决定T
```c++
template<typename T>
void f(T& param);               //param是一个引用

int x=27;                       //x是int
const int cx=x;                 //cx是const int
const int& rx=x;                //rx是指向作为const int的x的引用

f(x);                           //T是int，param的类型是int&
f(cx);                          //T是const int，param的类型是const int&
f(rx);                          //T是const int，param的类型是const int&
```
2. ParamType是一个通用引用
```c++
如果expr是左值，T和ParamType都会被推导为左值引用。这非常不寻常，第一，这是模板类型推导中唯一一种T被推导为引用的情况。第二，虽然ParamType被声明为右值引用类型，但是最后推导的结果是左值引用。

如果expr是右值，就使用正常的（也就是情景一）推导规则

template<typename T>
void f(T&& param);              //param现在是一个通用引用类型
        
int x=27;                       //如之前一样
const int cx=x;                 //如之前一样
const int & rx=cx;              //如之前一样

f(x);                           //x是左值，所以T是int&，
                                //param类型也是int& 发生了引用折叠?

f(cx);                          //cx是左值，所以T是const int&，
                                //param类型也是const int&

f(rx);                          //rx是左值，所以T是const int&，
                                //param类型也是const int&

f(27);                          //27是右值，所以T是int，
                                //param类型就是int&&
```

3. ParamType既不是指针也不是引用
```c++
和之前一样，如果expr的类型是一个引用，忽略这个引用部分
如果忽略expr的引用性（reference-ness）之后，expr是一个const，那就再忽略const。如果它是volatile，也忽略volatile（volatile对象不常见，它通常用于驱动程序的开发中。关于volatile的细节请参见Item40）


这是有意义的。param是一个完全独立于cx和rx的对象——是cx或rx的一个拷贝。具有常量性的cx和rx不可修改并不代表param也是一样

int x=27;                       //如之前一样
const int cx=x;                 //如之前一样
const int & rx=cx;              //如之前一样

f(x);                           //T和param的类型都是int
f(cx);                          //T和param的类型都是int
f(rx);                          //T和param的类型都是int

```

4. 数组实参
```c++
const char name[] = "J. P. Briggs";     //name的类型是const char[13]
template<typename T>
void f(T param);                        //传值形参的模板

f(name);                               //name是一个数组，但是T被推导为const char*

template<typename T>
void f(T& param);                       //name是一个数组引用，但是T被推导为const char(&)[13] 

有趣的是，可声明指向数组的引用的能力，使得我们可以创建一个模板函数来推导出数组的大小：
template<typename T,std::size_t N>
constexpr std::size_t arraySize(T(&)[N] param) {
    return N
}

const int a[2] = {1,2}
std::array<int, arraySize(keyVals)> mappedVals;         //mappedVals的大小为2
```

5. 函数实参
```c++
void someFunc(int, double);         //someFunc是一个函数，
                                    //类型是void(int, double)
template<typename T>
void f1(T param);                   //传值给f1

template<typename T>
void f2(T & param);                 //传引用给f2

f1(someFunc);                       //param被推导为指向函数的指针，
                                    //类型是void(*)(int, double)
f2(someFunc);                       //param被推导为指向函数的引用，
                                    //类型是void(&)(int, double)
```

k
### 条款2:理解auto的类型推导
+ auto类型通常与模板类型推导相同,除了花括号初始化列表
+ c++14中 lambda返回值和参数使用auto的工作机制是模板类型推导
```c++
auto p = {1,2,3}  // p 被推导为 initializer_list

template<typename T>
void func(T param);
func({1,2,3})     // 错误! 不能推导出T

除非
template<typename T>
void f(std::initializer_list<T> initList);

f({ 11, 23, 9 });               //T被推导为int，initList的类型为
                                //std::initializer_list<int>
```
### 条款3: 理解decltype
decltype只是简单的返回名字或者表达式的类型：
```c++
decltype(auto): auto说明符表示这个类型将会被推导，decltype说明decltype的规则将会被用到这个推导过程中。
// c++11
template <typename T>
auto func1(Contain&& c,Index 1) -> decltype(c[i]) {
    return std::forward<T>(c[i]);
}
函数名称前面的auto不会做任何的类型推导工作。相反的，他只是暗示使用了C++11的尾置返回类型语法

// c++14
template <typename T>
auto func1(Contain&& c,Index 1) -> decltype(c[i]) {
    return std::forward<T>(c[i]);
}

std::deque<int> d;
…
authAndAccess(d, 5) = 10;               //认证用户，返回d[5]，
                                        //然后把10赋值给它
                                        //无法通过编译器！

在这里d[5]本该返回一个int&，但是模板类型推导会剥去引用的部分，因此产生了int返回类型。函数返回的那个int是一个右值，上面的代码尝试把10赋值给右值int，C++11禁止这样做，所以代码无法编译。 没懂?

。C++期望在某些情况下当类型被暗示时需要使用decltype类型推导的规则，C++14通过使用decltype(auto)说明符使得这成为可能

Widget w;
const Widget& cw = w;
auto myWidget1 = cw;                    //auto类型推导
                                        //myWidget1的类型为Widget
decltype(auto) myWidget2 = cw;          //decltype类型推导
                                        //myWidget2的类型是const Widget&

另一个问题: 对于T类型的不是单纯的变量名的左值表达式，decltype总是产出T的引用即T&。
decltype(auto) f1()
{
    int x = 0;
    …
    return x;                            //decltype(x）是int，所以f1返回int
}

decltype(auto) f2()
{
    int x = 0;
    return (x);                          //decltype((x))是int&，所以f2返回int&
}


```

### 条款四：学会查看类型推导结果

1. 你编辑代码的时候
2. 编译期间
```c++
template<typename T>                //只对TD进行声明
class TD;                           //TD == "Type Displayer"

const int theAnswer = 42;
auto x = theAnswer;
auto y = &theAnswer;

TD<decltype(x)> xType;              //引出包含x和y
TD<decltype(y)> yType;              //的类型的错误消息


error: 'xType' uses undefined class 'TD<int>'
error: 'yType' uses undefined class 'TD<const int *>'
```
3. 运行时输出
```c++
这些工具可能既不准确也无帮助，所以理解C++类型推导规则才是最重要的
eg:
template<typename T>                    //要调用的模板函数
void f(const T& param);

std::vector<Widget> createVec();        //工厂函数

const auto vw = createVec();            //使用工厂函数返回值初始化vw

if (!vw.empty()){
    f(&vw[0]);                          //调用f
    …
}

使用typeid或者 std::type_info::name并不能真正反应类型，因为std::type_info::name规范批准像传值形参一样来对待这些类型。正如Item1提到的，如果传递的是一个引用，那么引用部分（reference-ness）将被忽略，如果忽略后还具有const或者volatile，那么常量性constness或者易变性volatileness也会被忽略。那就是为什么param的类型const Widget * const &会输出为const Widget *
template<typename T>
void f(const T& param)
{
    using std::cout;
    cout << "T =     " << typeid(T).name() << '\n';             //显示T

    cout << "param = " << typeid(param).name() << '\n';         //显示
    …                                                           //param
}                                                               //的类型

T =     class Widget const *
param = class Widget const *



Boost.TypeIndex
#include <boost/type_index.hpp>

template<typename T>
void f(const T& param)
{
    using std::cout;
    using boost::typeindex::type_id_with_cvr;

    //显示T
    cout << "T =     "
         << type_id_with_cvr<T>().pretty_name()
         << '\n';
    
    //显示param类型
    cout << "param = "
         << type_id_with_cvr<decltype(param)>().pretty_name()
         << '\n';
}

T =     class Widget const *
param = class Widget const * const &
```

## 第二章 auto
### 条款5:优先考虑auto而非显示类型声明

auto变量从初始化表达式中推导出类型，所以我们必须初始化。通常可以避免一些效率和移植性的问题，书写也方便
```c++
std::function<bool(const std::unique_ptr<Widget> &,
                   const std::unique_ptr<Widget> &)>
derefUPLess = [](const std::unique_ptr<Widget> &p1,
                 const std::unique_ptr<Widget> &p2)
                { return *p1 < *p2; };

auto derefLess =                                //C++14版本
    [](const auto& p1,                          //被任何像指针一样的东西
       const auto& p2)                          //指向的值的比较函数
    { return *p1 < *p2; };



std::unordered_map<std::string, int> m;
for(const std::pair<std::string, int>& p : m)
{
    …                                   //用p做一些事
}
它会通过拷贝m中的对象创建一个临时对象，这个临时对象的类型是p想绑定到的对象的类型，即m中元素的类型，然后把p的引用绑定到这个临时对象上。

for(const auto& p : m)
{
    …                                   //如之前一样
}

```

### 条款六 auto推导若非期望 使用显示类型初始化
auto很好  但不可见的代理类通常不适用于auto对于这种情况需要使用static_cast强制转换。
```c++
Widget w;
…
auto highPriority = features(w)[5];     //w高优先级吗？
…
processWidget(w, highPriority);         // 有问题! 会导致空悬指针

auto highPriority = static_cast<bool>(features(w)[5]); // good

```

## 第三章 现代c++
### 条款七：区别使用()和{}创建对象

1. 默认使用花括号初始化的开发者主要被适用面广、禁止变窄转换、免疫C++最令人头疼的解析这些优点所吸引。这些开发者知道在一些情况下（比如给定一个容器大小和一个初始值创建std::vector）要使用圆括号。

2. 默认使用圆括号初始化的开发者主要被C++98语法一致性、避免std::initializer_list自动类型推导、避免不会不经意间调用std::initializer_list构造函数这些优点所吸引。


3. 库开发者：如果一堆重载的构造函数中有一个或者多个含有std::initializer_list形参，用户代码如果使用了括号初始化，可能只会看到你std::initializer_list版本的重载的构造函数。因此，你最好把你的构造函数设计为不管用户是使用圆括号还是使用花括号进行初始化都不会有什么影响。


实践?
```c++

```

### 条款八：优先考虑nullptr而非0和NULL

### 条款九：优先考虑别名声明而非typedefs
```c++
// typedefs
template <typename T>
struct MyAllocList :{
    typedef std::list<T,MyAlloc<T>> type
}
MyAllocList<T>::type Allocate

// using
template <typename T>
using Ttype = std::list<T,MyAlloc<T>>

更糟的是:如果你想使用在一个模板内使用typedef声明一个链表对象，而这个对象又使用了模板形参，你就不得不在typedef前面加上typename：

// typedef
template <typename T>
struct Widght {
    typename MyAllocList<T>::type list
}

// using 
template <typename T>
struct Widght {
    Ttype<T> list
}

```
1. typedef不支持模板化，但是别名声明支持。

2. 别名模板避免了使用“::type”后缀，而且在模板中使用typedef还需要在前面加上typename

3. C++14提供了C++11所有type traits转换的别名声明版本

模板元编程:

### 条款十：优先考虑限域enum而非未限域enum

1. C++98的enum即非限域enum。

2. 限域enum的枚举名仅在enum内可见。要转换为其它类型只能使用cast。

3. 非限域/限域enum都支持底层类型说明语法，限域enum底层类型默认是int。非限域enum没有默认底层类型。

4. 限域enum总是可以前置声明。非限域enum仅当指定它们的底层类型时才能前置。

```c++
enum info { red, green, blue}
auto user = {0,1,2}
auto v = std::get<red>(user)        

// enum class
enum class info { red, green, blue}
auto v2 = std::get<static_cast<size_t>(info::red)>(user)

// 接收任意枚举返回值 c++11
template<typename E>
constexpr typename std::underlying_type<E>::type
    toUType(E enumerator) noexcept
{
    return
        static_cast<typename
                    std::underlying_type<E>::type>(enumerator);
}

// C++14
typename <class E>
constexpr auto toUType(E eparam) noexpect{
    return static_cast<std:underlying_type_t<E>>(eparam)
}

减少命名污染和隐式转换

```
### 条款十一：优先考虑使用deleted函数而非使用未定义的私有声明
1. 比起声明函数为private但不定义，使用deleted函数更好
2. 任何函数都能被删除（be deleted），包括非成员函数和模板实例（译注：实例化的函数）
```c++
template<>
void func1(double d)=delete; 
```
### 条款十二：使用override声明重写函数
1. 为重写函数加上override
2. 成员函数引用限定让我们可以区别对待左值对象和右值对象（即*this)

函数的引用限定符:
```c++
class Widget {
public:
    using DataType = std::vector<double>;
    …
    DataType& data() &              //对于左值Widgets,
    { return values; }              //返回左值
    
    DataType data() &&              //对于右值Widgets,
    { return std::move(values); }   //返回右值
    …

private:
    DataType values;
};


auto vals1 = w.data();              //调用左值重载版本的Widget::data，
                                    //拷贝构造vals1
auto vals2 = makeWidget().data();   //调用右值重载版本的Widget::data, 
                                    //移动构造vals2

```
### 条款十三：优先考虑const_iterator而非iterator
STL const_iterator等价于指向常量的指针（pointer-to-const）。它们都指向不能被修改的值。标准实践是能加上const就加上
```c++
// c++11
std::vector<int> values;                                //和之前一样
…
auto it =                                               //使用cbegin
    std::find(values.cbegin(), values.cend(), 1983);//和cend
values.insert(it, 1998);

// c++98
// typedef std::vector<int>::iterator IterT;               //typedef
typedef std::vector<int>::const_iterator ConstIterT;

std::vector<int> values;
…
ConstIterT ci =
    std::find(static_cast<ConstIterT>(values.begin()),  //cast
              static_cast<ConstIterT>(values.end()),    //cast
              1983);

values.insert(static_cast<IterT>(ci), 1998);    //可能无法通过编译，
                                                //原因见下

```

### 条款十四：如果函数不抛出异常请使用noexcept
1. 接口设计，明确的表达是否可能抛出异常
2. 生成更好的目标代码
3. noexcept对于移动语义，swap，内存释放函数和析构函数非常有用
4. 大多数函数是异常中立的（译注：可能抛也可能不抛异常）而不是noexcept

### 条款十五：尽可能的使用constexpr
> constexpr对象构建 "编译期可知的值" 。比如模板参数，数组大小，枚举值。可以将一部分运行时的计算放在编译期。constexpr函数在c++14后并不是一定返回const的。


1. constexpr是对象和函数接口的一部分
2. 当传递编译期可知的值时，constexpr函数可以产出编译期可知的结果
3. constexpr对象和函数可以使用的范围比non-constexpr对象和函数要大

不能假设constexpr函数的结果是const，也不能保证它们的（译注：返回）值是在编译期可知的

涉及到constexpr函数时，constexpr对象的使用情况就更有趣了。如果实参是编译期常量，这些函数将产出编译期常量；如果实参是运行时才能知道的值，它们就将产出运行时值。

```c++
// c++11限制
constexpr函数不超过一行
不能修改他们操作对象的状态
void返回类型不是字面值常量

以上在c++14放开

class Point {
public:
    constexpr Point(double xVal = 0, double yVal = 0) noexcept
    : x(xVal), y(yVal)
    {}

    constexpr double xValue() const noexcept { return x; } 
    constexpr double yValue() const noexcept { return y; }

    void setX(double newX) noexcept { x = newX; }
    void setY(double newY) noexcept { y = newY; }

private:
    double x, y;
};

constexpr Point p1(9.4, 27.7);  //没问题，constexpr构造函数
                                //会在编译期“运行”
constexpr Point p2(28.8, 5.3);  //也没问题

constexpr
Point midpoint(const Point& p1, const Point& p2) noexcept
{
    return { (p1.xValue() + p2.xValue()) / 2,   //调用constexpr
             (p1.yValue() + p2.yValue()) / 2 }; //成员函数
}
constexpr auto mid = midpoint(p1, p2);      //使用constexpr函数的结果
                                            //初始化constexpr对象

```

### 条款十六：让const成员函数线程安全
1. 确保const成员函数线程安全，除非你确定它们永远不会在并发上下文（concurrent context）中使用。
2. 使用std::atomic变量可能比互斥量提供更好的性能，但是它只适合操作单个变量或内存位置。
```c++
mutable :const修饰的方法中，mutable修饰的成员数据可以发生改变，除此之外不应该对类/对象带来副作用。

对于需要同步的是单个的变量或者内存位置，使用std::atomic就足够了。不过，一旦你需要对两个以上的变量或内存位置作为一个单元来操作的话，就应该使用互斥量。

volatile 用于修饰成员或变量，指示其修饰对象可能随时变化，编译器不要对所修饰变量进行优化（缓存），每次取值应该直接读取内存

class Widget {
public:
    …
    int magicValue() const
    {
        if (cacheValid) return cachedValue;
        else {
            auto val1 = expensiveComputation1();
            auto val2 = expensiveComputation2();
            cachedValue = val1 + val2;              //第一步
            cacheValid = true;                      //第二步
            return cachedValid;
        }
    }
    
private:
    mutable std::atomic<bool> cacheValid{ false };
    mutable std::atomic<int> cachedValue;
};

```
### 条款十七：理解特殊成员函数的生成
> 规则很多，最佳实践就是the rule of zero/three/five

zero:  对于不涉及资源管理的类，所有特殊成员都不需要定义。
three: 如果一个类显式声明了析构/拷贝/拷贝赋值(可能和默认拷贝的逻辑不同)其中的一个，那么其他两个也需要声明。
five:  对于需要移动操作的类，需要显式声明所偶有特殊成员。

1. 特殊成员函数是编译器可能自动生成的函数: 默认构造函数，析构函数，拷贝操作，移动操作。
移动操作会抑制自动拷贝的生成，拷贝操作会抑制自动移动的生成。
```c++
// 成员函数模板不抑制特殊成员函数的生成。
class Widget {
    …
    template<typename T>                //从任何东西构造Widget
    Widget(const T& rhs);

    template<typename T>                //从任何东西赋值给Widget
    Widget& operator=(const T& rhs);
    …
};

```
## 第四章 智能指针

### 条款十八：对于独占资源使用std::unique_ptr
> 独占资源的所有权。

1. std::unique_ptr是轻量级、快速的、只可移动（move-only）的管理专有所有权语义资源的智能指针
2. 默认情况，资源销毁通过delete实现，但是支持自定义删除器。有状态的删除器和函数指针会增加std::unique_ptr对象的大小
3. 将std::unique_ptr转化为std::shared_ptr非常简单

unique_ptr 很适合作为工厂函数的返回值

对于函数对象形式的删除器来说，变化的大小取决于函数对象中存储的状态多少，无状态函数（stateless function）对象（比如不捕获变量的lambda表达式）对大小没有影响，这意味当自定义删除器可以实现为函数或者lambda时，尽量使用lambda
```c++
template<typename... Ts>
auto makeInvestment(Ts&&... params)                 //C++14
{
    auto delInvmt = [](Investment* pInvestment)     //现在在
                    {                               //makeInvestment里
                        makeLogEntry(pInvestment);
                        delete pInvestment; 
                    };

    std::unique_ptr<Investment, decltype(delInvmt)> //同之前一样
        pInv(nullptr, delInvmt);
    if ( … )                                        //同之前一样
    {
        pInv.reset(new Stock(std::forward<Ts>(params)...));
    }
    else if ( … )                                   //同之前一样
    {     
        pInv.reset(new Bond(std::forward<Ts>(params)...));   
    }   
    else if ( … )                                   //同之前一样
    {     
        pInv.reset(new RealEstate(std::forward<Ts>(params)...));   
    }   
    return pInv;                                    //同之前一样
}

```
### 条款十九：对于共享资源使用std::shared_ptr
> shared_ptr用于管理需要共享所有权的资源。它的开销比unique_ptr稍高。体现在cb(控制块)里的删除器和虚继承。在最简单的情况下，cb是3个字大小。使用时注意避免双重指针的问题

+ 避免从原始指针变量上创建std::shared_ptr
```c++
auto p1 = make_shared<T>(1)
auto p2 = shared_ptr<T> (new T(1))
auto p3 = p2 // 可以

auto p4 = new T();
shared_ptr<T>  p5(p4)
shared_ptr<T>  p6(p4)  // 错误

+ 默认资源销毁是通过delete，但是也支持自定义删除器。删除器的类型是什么对于std::shared_ptr的类型没有影响。
+ 较之于std::unique_ptr，std::shared_ptr对象通常大两倍，控制块会产生开销，需要原子性的引用计数修改操作。
+ enable_shared_from_this解决这么一种场景: 安全的在类内生成该对象的shared_ptr
```c++`1
std::vector<std::shared_ptr<Widget>> processedWidgets;
class Widget: public std::enable_shared_from_this<Widget> {
public:
    …
    void process();
    …
};

void Widget::process()
{
    //和之前一样，处理Widget
    …
    //把指向当前对象的std::shared_ptr加入processedWidgets
    processedWidgets.emplace_back(shared_from_this());
}
```
### 条款二十：当std::shared_ptr可能悬空时使用std::weak_ptr
> 它不参与资源所有权的管理。用来配合shared_ptr的一些场景使用:并不关心所有权，只是当销毁时我可以知道。


+ 用std::weak_ptr替代可能会悬空的std::shared_ptr。
+ std::weak_ptr的潜在使用场景包括：缓存、观察者列表、打破std::shared_ptr环状结构。


如何判断对象是否销毁?
```c++
 if(w_ptr.expire()){
    w_ptr->f() // 错误的 weak_ptr没有解引用操作
 }

 auto p = w_ptr.lock() // 正确的 且线程安全
 if(p){
    p->f()  
 }
```

工厂函数的缓存:
```c++
// 返回shared_ptr, 但cache中是weak_ptr
std::shared_ptr<const Widget> fastLoadWidget(WidgetID id)
{
    static std::unordered_map<WidgetID,
                              std::weak_ptr<const Widget>> cache;
                                        //译者注：这里std::weak_ptr<const Widget>是高亮
    auto objPtr = cache[id].lock();     //objPtr是去缓存对象的
                                        //std::shared_ptr（或
                                        //当对象不在缓存中时为null）

    if (!objPtr) {                      //如果不在缓存中
        objPtr = loadWidget(id);        //加载它
        cache[id] = objPtr;             //缓存它
    }
    return objPtr;
}

```

从效率来说和shared_ptr的基本相同。

### 条款二十一：优先考虑使用std::make_unique和std::make_shared，而非直接使用new
> 使用make函数有很多有点: 打字少，性能好(只要一次内存分配),不会造成潜在的泄露。

> 不适用make函数的也有一些场景:
1. 自定义删除器 
2. 完美转发使用小括号，而不是花括号
3. 重载了 operator new和operator delete 这种系列行为不太适用于std::shared_ptr对自定义分配（通过std::allocate_shared）和释放（通过自定义删除器）的支持
4. 如果对象类型非常大，而且销毁最后一个std::shared_ptr和销毁最后一个std::weak_ptr之间的时间很长，那么在销毁对象和释放它所占用的内存之间可能会出现延迟。

(与直接使用new相比，std::make_shared在大小和速度上的优势源于std::shared_ptr的控制块与指向的对象放在同一块内存中。当对象的引用计数降为0，对象被销毁（即析构函数被调用）。但是，因为控制块和对象被放在同一块分配的内存块中，直到控制块的内存也被销毁，对象占用的内存才被释放。

)

更倾向于使用make函数，而不是完全依赖于它们

```c++
// 删除器的make函数 只能new
std::unique_ptr<T,decltype(dele1)> upw(new T,dele1);
std::shared_ptr<T> upw(new T,dele2);

// make函数中，完美转发使用小括号，而不是花括号
auto upv = make_unique<std::vector<int>>(10,20) // 10个20
std::shared_ptr<std::vector<int>> upw(new vector(10,29),dele2);

// 

class ReallyBigType { … };

auto pBigObj =                          //通过std::make_shared
    std::make_shared<ReallyBigType>();  //创建一个大对象
                    
…           //创建std::shared_ptrs和std::weak_ptrs
            //指向这个对象，使用它们

…           //最后一个std::shared_ptr在这销毁，
            //但std::weak_ptrs还在

…           //在这个阶段，原来分配给大对象的内存还分配着

…           //最后一个std::weak_ptr在这里销毁；
            //控制块和对象的内存被释放


class ReallyBigType { … };              //和之前一样

std::shared_ptr<ReallyBigType> pBigObj(new ReallyBigType);
                                        //通过new创建大对象

…           //像之前一样，创建std::shared_ptrs和std::weak_ptrs
            //指向这个对象，使用它们
            
…           //最后一个std::shared_ptr在这销毁,
            //但std::weak_ptrs还在；
            //对象的内存被释放

…           //在这阶段，只有控制块的内存仍然保持分配

…           //最后一个std::weak_ptr在这里销毁；
            //控制块内存被释放



processWidget( 									    
    std::shared_ptr<Widget>(new Widget, cusDel),    //潜在的内存泄漏！
    computePriority() 
);

std::shared_ptr<Widget> spw(new Widget, cusDel);
processWidget(spw, computePriority());  // 正确，但是没优化，见下

processWidget(std::move(spw), computePriority());   //高效且异常安全

```

c++14才引入make_unique

### 条款二十二：当使用Pimpl惯用法，请在实现文件中定义特殊成员函数
> 本条款仅针对 使用unique_ptr管理的impl指针。原因在于删除器是unique_ptr的一部分。在编译器生成默认析构函数时，impl指针所托管的对象类型T必须是完整类型(1).而shard_ptr并不需要这样(2)。

(1)在使用delete之前，通常会使默认删除器使用C++11的特性static_assert来确保原始指针指向的类型不是一个不完整类型
(2)而对std::shared_ptr而言，删除器的类型不是该智能指针的一部分，这让它会生成更大的运行时数据结构和稍微慢点的代码，但是当编译器生成的特殊成员函数被使用的时候，指向的对象不必是一个完整类型

+ 对于std::unique_ptr类型的pImpl指针，需要在头文件的类里声明特殊的成员函数，但是在实现文件里面来实现他们。即使是编译器自动生成的代码可以工作，也要这么做。
+ 以上的建议只适用于std::unique_ptr，不适用于std::shared_ptr。
```c++
// widget.h
class Widget {                  //跟之前一样，在“widget.h”中
public:
    Widget();
    ~Widget();                  //只有声明语句
    …

private:                        //跟之前一样
    struct Impl;
    std::unique_ptr<Impl> pImpl;
};

// widget.cpp
#include "widget.h"                 //跟之前一样，在“widget.cpp”中
#include "gadget.h"
#include <string>
#include <vector>

struct Widget::Impl {               //跟之前一样，定义Widget::Impl
    std::string name;
    std::vector<double> data;
    Gadget g1,g2,g3;
}

Widget::Widget()                    //跟之前一样
: pImpl(std::make_unique<Impl>())
{}

Widget::~Widget() =default                  //析构函数的定义（译者注：这里高亮）
```
### 第5章 右值引用 移动语义 完美转发

+ 移动语义使编译器有可能用廉价的移动操作来代替昂贵的拷贝操作。正如拷贝构造函数和拷贝赋值操作符给了你控制拷贝语义的权力，移动构造函数和移动赋值操作符也给了你控制移动语义的权力。移动语义也允许创建只可移动（move-only）的类型，例如std::unique_ptr，std::future和std::thread。
+ 完美转发使接收任意数量实参的函数模板成为可能，它可以将实参转发到其他的函数，使目标函数接收到的实参与被传递给转发函数的实参保持一致。


你对这些特点越熟悉，你就越会发现，你的初印象只不过是冰山一角。移动语义、完美转发和右值引用的世界比它所呈现的更加微妙。举个例子，std::move并不移动任何东西，完美转发也并不完美。移动操作并不永远比复制操作更廉价；即便如此，它也并不总是像你期望的那么廉价。而且，它也并不总是被调用，即使在当移动操作可用的时候。构造“type&&”也并非总是代表一个右值引用。
```c++
void f(Widget&& w);
```
形参w是一个左值，即使它的类型是一个rvalue-reference-to-Widget


### 条款二十三：理解std::move和std::forward

关于std::move

第一，不要在你希望能移动对象的时候，声明他们为const。对const对象的移动请求会悄无声息的被转化为拷贝操作。

第二点，std::move不仅不移动任何东西，而且它也不保证它执行转换的对象可以被移动。

你能确保的唯一一件事就是将它应用到一个对象上，你能够得到一个右值。

+ std::move执行到右值的无条件的转换，但就自身而言，它不移动任何东西。
+ std::forward只有当它的参数被绑定到一个右值时，才将参数转换为右值。
+ std::move和std::forward在运行期什么也不做。
```c++
class Annotation {
public:
    explicit Annotation(const std::string text)
    ：value(std::move(text))    //“移动”text到value里；这段代码执行起来
    { … }                       //并不是看起来那样
    
    …

private:
    std::string value;
};

```

### 条款二十四：区分通用引用与右值引用
> 形如T&&,并且T被推导那么它就是通用引用。它可以接收(const)-lvalue/rvalue,并且可以正确推导。其是对引用折叠的抽象

+ 如果一个函数模板形参的类型为T&&，并且T需要被推导得知，或者如果一个对象被声明为auto&&，这个形参或者对象就是一个通用引用。
+ 如果类型声明的形式不是标准的type&&，或者如果类型推导没有发生，那么type&&代表一个右值引用。
+ 通用引用，如果它被右值初始化，就会对应地成为右值引用；如果它被左值初始化，就会成为左值引用。

### 条款二十五：对右值引用使用std::move，对通用引用使用std::forward
> 关于何时使用std::move和std::forward:即 转发给其他函数时，分发函数形参为右值引用的使用move,通用引用的使用forward

> 如果在按值返回的函数中，返回值绑定到右值引用或者通用引用上，需要对返回的引用使用std::move

```C++
Matrix                              //按值返回
operator+(Matrix&& lhs, const Matrix& rhs)
{
    lhs += rhs;
    return std::move(lhs);	        //移动lhs到返回值中
}

// 一个常见的错误
Widget makeWidget()                 //makeWidget的“拷贝”版本
{
    Widget w;                       //局部对象
    …                               //配置w
    return w;                       //“拷贝”w到返回值中 
    return std::move(w);            // 错误的 会抑制编译器优化拷贝消除（RVO？）返回的已经不是局部对象w，而是**w的引用**——std::move(w)的结果。
}
RVO:（1）局部对象与函数返回值的类型相同；（2）局部对象就是要返回的东西。

```

右值引用转发给其他函数时，右值引用应该被无条件转换为右值（通过std::move），因为它们总是绑定到右值；当转发通用引用时，通用引用应该有条件地转换为右值（通过std::forward），因为它们只是有时绑定到右值。


有一些没懂:
拷贝消除: 返回值优化 RVO 
class Widget {
public:
    template<typename T>
    void setName(T&& newName)       //通用引用可以编译，
    { name = std::move(newName); }  //但是代码太太太差了！
    …

private:
    std::string name;
    std::shared_ptr<SomeDataStructure> p;
};

std::string getWidgetName();        //工厂函数

Widget w;

auto n = getWidgetName();           //n是局部变量

w.setName(n);                       //把n移动进w！

…                                   //现在n的值未知

使用通用引用的版本的setName，字面字符串“Adela Novak”可以被传递给setName，再传给w内部std::string的赋值运算符。w的name的数据成员通过字面字符串直接赋值，没有临时std::string对象被创建。


template<typename T>
void setSignText(T&& text)                  //text是通用引用
{
  sign.setText(text);                       //使用text但是不改变它 ? 没懂?
  
  auto now = 
      std::chrono::system_clock::now();     //获取现在的时间
  
  signHistory.add(now, 
                  std::forward<T>(text));   //有条件的转换为右值
}



### 条款二十六：避免在通用引用上重载
> 重载类内模板成员函数通常会因为重载决议的规则导致匹配的不是期望的，尤其是完美转发构造函数。直接调用和继承都很容易有问题

```c++
class Person {
public:
    template<typename T>
    explicit Person(T&& n)              //完美转发的构造函数，初始化数据成员
    : name(std::forward<T>(n)) {}

    explicit Person(int idx)            //int的构造函数
    : name(nameFromIdx(idx)) {}
    …
    
    Person(const Person& rhs);      //拷贝构造函数（编译器生成）
    Person(Person&& rhs);           //移动构造函数（编译器生成）
private:
    std::string name;
};

Person p("Nancy"); 
auto cloneOfP(p);                   //从p创建新Person；这通不过编译！

```
+ 对通用引用形参的函数进行重载，通用引用函数的调用机会几乎总会比你期望的多得多。
+ 完美转发构造函数是糟糕的实现，因为对于non-const左值，它们比拷贝构造函数而更匹配，而且会劫持派生类对于基类的拷贝和移动构造函数的调用。

### 条款二十七：熟悉通用引用重载的替代方法
```
通用引用和重载的组合替代方案包括使用不同的函数名，通过lvalue-reference-to-const传递形参，按值传递形参，使用tag dispatch。
通过std::enable_if约束模板，允许组合通用引用和重载使用，但它也控制了编译器在哪种条件下才使用通用引用重载。
通用引用参数通常具有高效率的优势，但是可用性就值得斟酌。
```


+ 放弃重载，使用不同的函数名。

+ 放弃通用引用，使用lvalue-reference-const形参。 根据重载决议选择拷贝构造函数 而不是 模板构造函数
```c++
class Person {
public:
    template<typename T>
    explicit Person(const T& n)              //完美转发的构造函数，初始化数据成员
    : name(std::forward<T>(n)) {}

    explicit Person(int idx)            //int的构造函数
    : name(nameFromIdx(idx)) {}
    …
    
    Person(const Person& rhs);      //拷贝构造函数（编译器生成）
    Person(Person&& rhs);           //移动构造函数（编译器生成）
private:
    std::string name;
};
```


+ 放弃通用引用，使用值传递。 Item41(?)
```c++
class Person {
public:
    explicit Person(std::string n)  //代替T&&构造函数，
    : name(std::move(n)) {}         //std::move的使用见条款41
  
    explicit Person(int idx)        //同之前一样
    : name(nameFromIdx(idx)) {}
    …

private:
    std::string name;
};

```
+ 使用 tag dispatch

多传一个参数，在里面重载，在外面传通用引用

```c++
class Person {
public:
    template<typename T>
    explicit Person(T&& person) {
        PersonImp(std::forward<T>(person),std::is_integer<std::remove_reference_t<T>>())
    }
    template<typename T>
    void PersonImp(T&& person,std::type_false){
        // 不是int 
        v.emplace_back(std::forward<T>(person));
    }
    template<typename T>
    void PersonImp(T&& personId,std::type_true){
        // 是int 
        // v.emplace_back(IdToName(personId))
        logAndAdd(nameFromIdx(idx)); 
    }

}
```

+ 约束使用通用引用的模板

使用type trait 和contidion 指定在什么条件下实例化模板
```c++

😅😅😅😅😅 
// 11
class Person: {
public:
    template<typename T = typename std::enable_if<
    !std::is_base_of<Person,typename std::decay<T>::type>>::type
    &&
    !std::is_integral<std::remove_reference_t<T>>::value
    >::value
    explicit Person(T&& person) {
        v.emplace_back(std::forward<T>(person));
    }
}

// 14

class Person {
public:
    template<
        typename T,
        typename = std::enable_if_t<
            !std::is_base_of<Person, std::decay_t<T>>::value
            &&
            !std::is_integral<std::remove_reference_t<T>>::value
        >
    >
    explicit Person(T&& n)          //对于std::strings和可转化为
    : name(std::forward<T>(n))      //std::strings的实参的构造函数
    { … }

    explicit Person(int idx)        //对于整型实参的构造函数
    : name(nameFromIdx(idx))
    { … }

    …                               //拷贝、移动构造函数等

private:
    std::string name;
};

```



### 条款二十八：理解引用折叠
是什么? 类型推导的规则，形式为右值引用。当类型推导区分左右值，并且发生引用折叠的那些地方。

解决了什么问题?  类型推导时的引用重叠

发生时机: template，auto,decltype,typedef 

```c++
// forward
template <class T>
T&& forward(typename std::remove_reference<T>& params) {
    return static_cast<T&&>(params)
}


std::forward<Person>(params)
当T是左值引用时， 发生引用折叠
template <class T>
Person& forward(Person& params) {
    return static_cast<Person&>(params)
}

当T是右值引用时， 发生引用折叠
template <class T>
Person&& forward(Person& params) {
    return static_cast<Person&&>(params)
}

```
### 条款二十九：假定移动操作不存在，成本高，未被使用
> 能理解 但不是很有体会

存在几种情况，C++11的移动语义并无优势：
```c++
没有移动操作：要移动的对象没有提供移动操作，所以移动的写法也会变成复制操作。
移动不会更快：要移动的对象提供的移动操作并不比复制速度更快。
移动不可用：进行移动的上下文要求移动操作不会抛出异常，但是该操作没有被声明为noexcept。
```

### 条款三十：熟悉完美转发失败的情况
常量传播 ?

导致完美转发失败的实参种类有花括号初始化，作为空指针的0或者NULL，仅有声明的整型static const数据成员，模板和重载函数的名字，位域。


## 第六章 lambda表达式

```c++
std::find_if(container.begin(), container.end(),
             [](int val){ return 0 < val && val < 10; });   //译者注：本行高亮

```

闭包（enclosure）是lambda创建的运行时对象。依赖捕获模式，闭包持有被捕获数据的副本或者引用。在上面的std::find_if调用中，闭包是作为第三个实参在运行时传递给std::find_if的对象。

闭包类（closure class）是从中实例化闭包的类。每个lambda都会使编译器生成唯一的闭包类。lambda中的语句成为其闭包类的成员函数中的可执行指令。

非正式的讲，模糊lambda，闭包和闭包类之间的界限是可以接受的。但是，在随后的Item中，区分什么存在于编译期（lambdas 和闭包类），什么存在于运行时（闭包）以及它们之间的相互关系是重要的。


### 条款三十一：避免使用默认捕获模式
> 默认按引用捕获的模式可能会带来悬空应用的问题。默认按值捕获也不会解决上述问题，反而会暗示你以为闭包是独立的

从长期来看，显式列出lambda依赖的局部变量和形参，是更加符合软件工程规范的做法。


捕获只能应用于lambda被创建时所在作用域里的non-static局部变量（包括形参）


静态存储生命周期（static storage duration）对象不会被捕获，但可以在lambda中使用。值传递可能会让你以为捕获了这些变量
```c++

// 默认按引用捕获会造成空悬引用
using FilterContainer =                     //“using”参见条款9，
    std::vector<std::function<bool(int)>>;  //std::function参见条款2

FilterContainer filters;                    //过滤函数

void addDivisorFilter()
{
    auto calc1 = computeSomeValue1();
    auto calc2 = computeSomeValue2();

    auto divisor = computeDivisor(calc1, calc2);

    filters.emplace_back(                               //危险！对divisor的引用
        [&](int value) { return value % divisor == 0; } //将会悬空！
    );
}

// 默认按值捕获并不会解决问题
// 可以通过按值捕获解决上述问题，但是在某些情况下，并不能完全解决
class Widget {
public:
    …                       //构造函数等
    void addFilter() const; //向filters添加条目
private:
    int divisor;            //在Widget的过滤器使用
};

void Widget::addFilter() const
{
    auto Obj = this          // 应该是 auto div = divsor 捕获的数据成员做一个局部副本
    filters.emplace_back(
        [=](int value) { return value % Obj->divisor == 0; }
    );
}	

// 错误的用法
void doSomeWork()
{
    auto pw =                               //创建Widget；std::make_unique
        std::make_unique<Widget>();         //见条款21

    pw->addFilter();                        //添加使用Widget::divisor的过滤器

    …
}                                           //销毁Widget；filters现在持有悬空指针！

------

```

### 条款三十二：使用初始化捕获来移动对象到闭包中
> c++14可以使用初始化捕获来构造对象。 而在c++11中可以使用bind完成等效的功能

```c++
class Widget {                          //一些有用的类型
public:
    …
    bool isValidated() const;
    bool isProcessed() const;
    bool isArchived() const;
private:
    …
};

auto pw = std::make_unique<Widget>();   //创建Widget；使用std::make_unique
                                        //的有关信息参见条款21

…                                       //设置*pw

auto func = [pw = std::move(pw)]        //使用std::move(pw)初始化闭包数据成员
            { return pw->isValidated()
                     && pw->isArchived(); };


// c++11
auto func = std::bind([](const std::unique_ptr<Widget>& pw){return pw->isValidated() && pw->isArchived()},std::move(pw))
```

### 条款三十三：对auto&&形参使用decltype以std::forward它们
> 一个惯用法
```c++
auto f = [](auto x){ return func(normalize(x)); };
考虑到normalize可能对待左右值的方式不同。 我们需要通用引用+完美转发

auto f = [](auto&& x){ return func(normalize(std::forward<decltype(x)>(x))); };

考虑到多参数

auto f = [](auto&&... x){return func(normalize(std::forward<decltype(x)>(x)...)); }
```


### 条款三十四：考虑lambda而非std::bind
+ 与使用std::bind相比，lambda更易读，更具表达力并且可能更高效。
+ 只有在C++11中，std::bind可能对实现移动捕获或绑定带有模板化函数调用运算符的对象时会很有用。


## 第七章 并发API
### 条款三十五：优先考虑基于任务的编程而非基于线程的编程
### 条款三十六：如果有异步的必要请指定std::launch::async
### 条款三十七：使std::thread在所有路径最后都不可结合
### 条款三十八：关注不同线程句柄的析构行为
### 条款三十九：对于一次性事件通信考虑使用void的futures
### 条款四十：对于并发使用std::atomic，对于特殊内存使用volatile
> atomic用于RAM，保证编译器和硬件不会重排指令。volatile用于特殊内存(内存映射i/o，与外部设备通信)，意味着告诉编译器“不要对这块内存执行任何优化”

```c++
int x = 20 
x = 10 

编译器最终会优化为 x = 10 

volatile int x = 20 
x = 10 

这意味着不会做任何优化 
```

## 第八章 微调 
### 条款四十一：对于移动成本低且总是被拷贝的可拷贝形参，考虑按值传递 


当形参通过赋值进行拷贝时，分析按值传递的开销是复杂的。通常，最有效的经验就是“在证明没问题之前假设有问题”，就是除非已证明按值传递会为你需要的形参类型产生可接受的执行效率，否则使用重载或者通用引用的实现方式。

其他方法:

+ 两个重载
+ 通用引用

还不太懂 可能要复习一下 string的拷贝构造 赋值拷贝