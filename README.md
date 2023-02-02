```tsx
<div className="foo" classList="bar">
// 🔃
<div className="foo bar">


<div className="foo">
// 🔃
<div className="foo">


<div classList="foo">
// 🔃
<div className="foo">


<div classList={{foo: true}}>
// 🔃
<div className={classnames({foo: true})}>


<div className={dynamic} classList={{foo: true}}>
// 🔃
<div className={classnames(dynamic, {foo: true})}>


<div className="foo" classList={{bar: true}}>
// 🔃
<div className={classnames("foo", {bar: true})}>


<div className="foo" classList={["bar", { baz: true }]}>
// 🔃
<div className={classnames("foo", ["bar", {bar: true}])}>


<div className="foo" classList={[dynamic, { baz: true }]}>
// 🔃
<div className={classnames("foo", [dynamic, {bar: true}])}>
```