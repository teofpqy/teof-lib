import deepClone from './index';

const arr1 = [1,2,3,4];
const regExp1 = /.jsx?$/gim;
const date_now = new Date();

const obj1 = {
  arr1,
  regExp1,
  date_now,
  name: 'teof',
}

const _toString = (obj) => Object.prototype.toString.call(obj);

describe('array deep clone ', () => {
  const cloneArr = deepClone(arr1);
  test('is value equal', () => {
    expect(cloneArr).toEqual(arr1);
  });
  test('has same type', () => {
    expect(_toString(cloneArr)).toBe(_toString(arr1))
  })
  test('not same obj', () => {
    expect(cloneArr === arr1).toBeFalsy();
  })
});

describe('regExp deep clone', () =>{
  const cloneExp = deepClone(regExp1);
  test('is value equal', () => {
    expect(cloneExp.source).toEqual(regExp1.source);
    expect(cloneExp.flags).toEqual(regExp1.flags);
    expect(cloneExp.toString()).toEqual(regExp1.toString());
  });
  test('has same type', () => {
    expect(_toString(cloneExp)).toBe(_toString(regExp1))
  })
  test('not same obj', () => {
    expect(cloneExp === regExp1).toBeFalsy();
  })
});

describe('datetime deep clone',() => {
  const clone_date = deepClone(date_now);
  test('is value equal', () => {
    expect(clone_date.getTime()).toEqual(date_now.getTime());
  });
  test('has same type', () => {
    expect(_toString(clone_date)).toBe(_toString(date_now))
  });
  test('not same obj', () => {
    expect(clone_date === date_now).toBeFalsy();
  });
})

describe('obj deep clone', () => {
  const clone_obj = deepClone(obj1);
  test('is value equal', () => {
    expect(clone_obj.name).toBe(obj1.name);
    expect(clone_obj.arr1).toEqual(obj1.arr1);
    expect(clone_obj.regExp1.toString()).toBe(obj1.regExp1.toString());
    expect(clone_obj.date_now.getTime()).toBe(obj1.date_now.getTime());
  });
  test('has same type', () => {
    expect(_toString(clone_obj)).toBe(_toString(obj1))
  })
  test('not same obj', () => {
    expect(clone_obj === obj1).toBeFalsy();
  })
})
