export async function promiseWrap<T>(promise: Promise<T> | undefined) {
  let data;
  if (!promise) return { data: null, error: null };
  try {
    data = await promise;
  } catch (e) {
    return { error: e, data: null };
  }

  return { error: null, data };
}
