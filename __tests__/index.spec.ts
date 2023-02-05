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

it('class name and class list are concatenated when both are strings', () => {
  const result = doTransform(dedent`
		<div classList="123" className="22323">Hello</div>
	`);

  expect(result).to.equal('<div className="22323 123">Hello</div>');
});

it('works normally when only className is present', () => {
  const result = doTransform(dedent`
  <div className="123">Hello</div>
`);

  expect(result).to.equal('<div className="123">Hello</div>');
});

it('works normally when only classList is present', () => {
  const result = doTransform(dedent`
		<div classList="123">Hello</div>
	`);

  expect(result).to.equal('<div className="123">Hello</div>');
});

it('classList is an objectExpression and className is a string', () => {
  const result = doTransform(dedent`
  <div className="123" classList={{a: true, b: false}}>Hello</div>
`);

  expect(result).to.equal(dedent`<div className={__clx("123", {
    a: true,
    b: false
  })}>Hello</div>`);
});

it('classList is an objectExpression and className not present', () => {
  const result = doTransform(dedent`
  <div classList={{a: true, b: false}}>Hello</div>
`);

  expect(result).to.equal(dedent`<div className={__clx({
    a: true,
    b: false
  })}>Hello</div>`);
});

it('both className and classList are objectExpressions', () => {
  const result = doTransform(dedent`
  <div className={foo} classList={{a: true, b: false}}>Hello</div>
`);

  expect(result).to.equal(dedent`<div className={__clx(foo, {
    a: true,
    b: false
  })}>Hello</div>`);
});

it('classList is an array of expression', () => {
  const result = doTransform(dedent`
  <div className={foo} classList={[bar, {a: true, b: false}]}>Hello</div>
`);

  expect(result).to.equal(dedent`<div className={__clx(foo, [bar, {
    a: true,
    b: false
  }])}>Hello</div>`);
});

it('references classList and string className', () => {
  const result = doTransform(dedent`
  <div className="foo" classList={bar}>Hello</div>
`);

  expect(result).to.equal(dedent`<div className={__clx("foo", bar)}>Hello</div>`);
});
