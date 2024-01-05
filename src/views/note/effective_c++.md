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
+ 用std::weak_ptr替代可能会悬空的std::shared_ptr。
+ std::weak_ptr的潜在使用场景包括：缓存、观察者列表、打破std::shared_ptr环状结构。