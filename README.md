# babel-plugin-jsx-classlist

After using tailwind/windiss, writing JSX requires the tedious task of concatenating class names. To do this, one must go to the top of the file, import classnames, and then go back to where they were to use classnames to merge multiple styles.

The built-in classList in solidjs provides a smoother coding experience by using classList as a dynamic property.

Therefore, I wrote this Babel plugin

# Usage

1.Install Dependencies

```bash
npm install babel-plugin-jsx-classlist -D
npm install classnames
```

2.Setup Plugin

```diff
// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [
    react({
      babel: {
+        plugins: ['jsx-classlist'],
      },
    }),
  ],
});
```

3.Setup TypeScript

```diff
// vite-env.d.ts
/// <reference types="vite/client" />
+/// <reference types="babel-plugin-jsx-classlist/type" />

```

# Example

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
