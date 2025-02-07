export const fetchResults = async (resultId: string) => {
  return new Promise((resolve) => {
    setTimeout(
      () => {
        import('@data/results.json').then((module) => {
          const results = module.default;
          const result = results.find((r) => r.id === resultId);
          resolve(result || null);
        });
      },
      Math.random() * 50 + 100,
    ); // Simulated delay between 100-150ms
  });
};
