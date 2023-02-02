import { expect, it } from 'vitest';
import dedent from 'dedent';
import { transform } from '@babel/core';
import plugin from '../src/index';

function doTransform(input: string) {
  const result = transform(input, {
    plugins: ['syntax-jsx', plugin],
  });

  if (!result) {
    throw new Error('transform failed');
  }

  const code = result.code;

  return code?.includes('__clx')
    ? code?.split('\n').slice(1).join('\n').replace(/;$/, '')
    : code?.replace(/;$/, '');
}

it('className 和 classList都是字符串时直接拼接', () => {
  const result = doTransform(dedent`
		<div classList="123" className="22323">Hello</div>
	`);

  expect(result).to.equal('<div className="22323 123">Hello</div>');
});

it('只有 className 的情况下正常工作', () => {
  const result = doTransform(dedent`
  <div className="123">Hello</div>
`);

  expect(result).to.equal('<div className="123">Hello</div>');
});

it('只有 classList 的情况下也正常工作', () => {
  const result = doTransform(dedent`
		<div classList="123">Hello</div>
	`);

  expect(result).to.equal('<div className="123">Hello</div>');
});

it('只有 classList 的情况下也正常工作', () => {
  const result = doTransform(dedent`
		<div className="123">Hello</div>
	`);

  expect(result).to.equal('<div className="123">Hello</div>');
});

it('动态属性', () => {
  const result = doTransform(dedent`
  <div className="123" classList={{a: true, b: false}}>Hello</div>
`);

  expect(result).to.equal(dedent`<div className={__clx("123", {
    a: true,
    b: false
  })}>Hello</div>`);
});

it('只有classList动态属性', () => {
  const result = doTransform(dedent`
  <div classList={{a: true, b: false}}>Hello</div>
`);

  expect(result).to.equal(dedent`<div className={__clx({
    a: true,
    b: false
  })}>Hello</div>`);
});

it('className 动态和 classList 动态', () => {
  const result = doTransform(dedent`
  <div className={foo} classList={{a: true, b: false}}>Hello</div>
`);

  expect(result).to.equal(dedent`<div className={__clx(foo, {
    a: true,
    b: false
  })}>Hello</div>`);
});

it('classList 数组情况正常', () => {
  const result = doTransform(dedent`
  <div className={foo} classList={[bar, {a: true, b: false}]}>Hello</div>
`);

  expect(result).to.equal(dedent`<div className={__clx(foo, [bar, {
    a: true,
    b: false
  }])}>Hello</div>`);
});