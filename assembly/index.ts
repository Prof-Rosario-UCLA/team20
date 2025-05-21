export function addRecentPublications(ptr: usize, data: i32): i32 {
  let result = 0;
  for (let i = 0; i < data; i++) {
    result += load<i32>(ptr + i * 4);
  }
  return result;
}