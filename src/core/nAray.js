const nAry = (base = 2) => (length = 0) => {
  const range = base - 1;

  const zero = Array(length).fill(0);

  const inc = (vector) => {
    const index = vector.findIndex(digit => digit < range);
    return index === -1 ? (
      zero
    ) : [
      ...Array(index).fill(0),
      vector[index] + 1,
      ...vector.filter((_, i) => i > index)
    ];
  };

  const all = () => {
    const vectors = [zero];
    for (let i = 1; i < Math.pow(base, length); i++) {
      vectors.push(inc(vectors[i - 1]));
    }
    return vectors;
  };

  return {
    inc,
    all,
    zero,
    length,
  };
};

export default nAry;
